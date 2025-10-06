module.exports = db => {
  const logError    = require('../../utils/utils')(db).logError;
  const Stripe      = require('stripe');

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const createStripeCheckoutSession = (customerId) => {
    return stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: 'http://localhost:5000/user/subscribe/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5000/user/subscribe/failure',
    });
  };

  return {

    find: (req, res) => {
      db.query(`SELECT s.*,
        CONCAT(u.last_name, ' ', u.first_name) AS name, u.email
        FROM "User" u
        RIGHT JOIN "Subscription" s ON s.id_user = u.id
        WHERE u.id = ${req.params.id_user}`, { type: db.QueryTypes.SELECT }).then(subscription => {
          // If it has a subscription, then find all the past invoices
          if(subscription.length) {
            db.query(`SELECT i.*
              FROM "Invoice" i
              WHERE i.id_subscription = ${subscription[0].id}`, { type: db.QueryTypes.SELECT }).then(invoices => {
                res.json({subscription: subscription[0], invoices: invoices});
            }).catch(e => logError(req.user, `subscriptionCtrl - find invoices`, e, res, req));
          } else {
            // Else return null to user
            res.json({subscription: null, invoices: []});
          }
      }).catch(e => logError(req.user, `subscriptionCtrl - find`, e, res, req));
    },

    subscribe: (req, res) => {
      // Find the stripe_customer_id
      db.query(`SELECT u.id, u.email, u.stripe_customer_id
        FROM "User" u
        WHERE u.id = ${req.body.id}`, { type: db.QueryTypes.SELECT }).then(r => {
          const user = r.length ? r[0] : null;

          if(user) {
            // if exists such an User
            if(!user.stripe_customer_id) {

              // create Stripe user if it's first time to subscribe
              stripe.customers.create({ email: user.email }).then(customer => {

                // update then User to new stripe_customer_id
                db.query(`UPDATE "User" SET stripe_customer_id = '${customer.id}' WHERE id = ${user.id}`).then(() => {

                    // create session for begining the subscribe
                    createStripeCheckoutSession(customer.id).then(session => {
                      res.json({ url: session.url });
                    }).catch(e => logError(req.user, `subscriptionCtrl - subscribe - exists Stripe customer - on stripe error`, e, res, req));
                }).catch(e => logError(req.user, `subscriptionCtrl - update User to new stripe_customer_id`, e, res, req));
              }).catch(e => logError(req.user, `subscriptionCtrl - subscribe - on stripe create customer error`, e, res, req));
            } else {

              // if exist Stripe customer, then only create payment mode
              createStripeCheckoutSession(user.stripe_customer_id).then(session => {
                res.json({ url: session.url });
              }).catch(e => logError(req.user, `subscriptionCtrl - subscribe - exists Stripe customer - on stripe error`, e, res, req));
            }
          } else {
            logError(req.user, `subscriptionCtrl - subscribe - not found User`, e, res, req);
          }
      }).catch(e => logError(req.user, `subscriptionCtrl - subscribe - no User found`, e, res, req));
    },

    portal: (req, res) => {
      // Find the stripe_customer_id
      db.query(`SELECT s.stripe_customer_id
        FROM "Subscription" s
        WHERE s.id = ${req.body.id}`, { type: db.QueryTypes.SELECT }).then(r => {
          const stripe_customer_id = r.length ? r[0].stripe_customer_id : null;

          if(stripe_customer_id) {
            // create url for user to enter
            stripe.billingPortal.sessions.create({
              customer: stripe_customer_id,
              return_url: 'http://localhost:4200/dashboard', // redirect after update
            }).then(portalSession => {
              res.json({ url: portalSession.url });
            }).catch(e => logError(req.user, `subscriptionCtrl - portal - on stripe error`, e, res, req));
          } else {
            logError(req.user, `subscriptionCtrl - portal - not found Subscription`, e, res, req);
          }
      }).catch(e => logError(req.user, `subscriptionCtrl - find`, e, res, req));
    },

    cancel: (req, res) => {
      // Find the stripe_subscription_id
      db.query(`SELECT s.stripe_subscription_id
        FROM "Subscription" s
        WHERE s.id = ${req.body.id}`, { type: db.QueryTypes.SELECT }).then(r => {
          const stripe_subscription_id = r.length ? r[0].stripe_subscription_id : null;

          // Cancel at period end
          stripe.subscriptions.update(stripe_subscription_id, {
            cancel_at_period_end: true
          }).then(canceled => {

            // Update the db Subscription row status
            db.query(`UPDATE "Subscription" SET status = ${canceled.status} WHERE id = ${req.body.id}`, { type: db.QueryTypes.SELECT }).then(() => {
              res.json({ success: true, status: canceled.status });
            }).catch(e => logError(req.user, `subscriptionCtrl - cancel - update subscription status`, e, res, req));

          }).catch(e => logError(req.user, `subscriptionCtrl - cancel - on stripe error`, e, res, req));
      }).catch(e => logError(req.user, `subscriptionCtrl - find`, e, res, req));
    }
  };
}