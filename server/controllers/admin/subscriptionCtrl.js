module.exports = db => {
  const logError    = require('../../utils/utils')(db).logError;
  const Stripe      = require('stripe');
  const { Pool }    = require('pg');

  // const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  // const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  return {

    find: (req, res) => {
      db.query(`SELECT s.*,
        CONCAT(u.last_name, ' ', u.first_name) AS name, u.email
        FROM "Subscription" s
        LEFT JOIN "User" u ON u.id = s.id_user
        WHERE s.id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r.length ? r[0] : {});
      }).catch(e => logError(req.user, `subscriptionCtrl - find`, e, res, req));
    },

    findAll: (req, res) => {
      db.query(`SELECT s.*,
        CONCAT(u.last_name, ' ', u.first_name) AS name, u.email
        FROM "Subscription" s
        LEFT JOIN "User" u ON u.id = s.id_user`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r);
      }).catch(e => logError(req.user, `subscriptionCtrl - findAll`, e, res, req));
    },

    cancel: (req, res) => {
      // Find the stripe_subscription_id
      db.query(`SELECT s.stripe_subscription_id
        FROM "Subscription" s
        WHERE s.id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(r => {
          const stripe_subscription_id = r.length ? r[0].stripe_subscription_id : null;

          // Cancel at period end
          stripe.subscriptions.update(stripe_subscription_id, {
            cancel_at_period_end: true
          }).then(canceled => {

            // Update the db Subscription row status
            db.query(`UPDATE "Subscription" SET status = ${canceled.status} WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(() => {
              res.json({ success: true, status: canceled.status });
            }).catch(e => logError(req.user, `subscriptionCtrl - cancel - update subscription status`, e, res, req));

          }).catch(e => logError(req.user, `subscriptionCtrl - cancel - on stripe error`, e, res, req));
      }).catch(e => logError(req.user, `subscriptionCtrl - find`, e, res, req));
    },

    refund: (req, res) => {
      // Find the stripe_customer_id
      db.query(`SELECT s.stripe_customer_id
        FROM "Subscription" s
        WHERE s.id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(r => {
          const stripe_customer_id = r.length ? r[0].stripe_customer_id : null;

          // Find the last invoice for this cutomer
          stripe.invoices.list({ customer: stripe_customer_id, limit: 1 }).then(invoices => {
            const latestInvoice = invoices.data[0];

            // If it was not found none, then return 400 status
            if(!latestInvoice || !latestInvoice.payment_intent) {
              res.status(400).json({ error: 'No payment found' });
            } else {
              // Else create refund request
              stripe.refunds.create({ payment_intent: latestInvoice.payment_intent }).then(refund => {
                res.json({ success: true, id_refund: refund.id });
              }).catch(e => logError(req.user, `subscriptionCtrl - refund - create refund request`, e, res, req));
            }
          }).catch(e => logError(req.user, `subscriptionCtrl - refund - find the last invoice in stripe`, e, res, req));
      }).catch(e => logError(req.user, `subscriptionCtrl - find`, e, res, req));
    }
  };
}