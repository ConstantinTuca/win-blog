module.exports = db => {
  const logError    = require('../../utils/utils')(db).logError;
  const Stripe      = require('stripe');

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  return {
    handleWebhook: async (req, res) => {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object;
            const customerId = session.customer;
            const subscriptionId = session.subscription;

            // Find user
            const userRes = await db.query(`SELECT id FROM "User" WHERE stripe_customer_id=${customerId}`, {type: db.QueryTypes.SELECT});
            if (userRes.length) {
              const userId = userRes[0].id;

              const period_start = session.start_date || Math.floor(Date.now() / 1000);
              const period_end = session.expires_at || Math.floor(Date.now() / 1000) + 2592000;
              await db.query(
                `INSERT INTO "Subscription" (id_user, stripe_subscription_id, status, current_period_start, current_period_end)
                VALUES (${userId}, ${subscriptionId}, 'active', to_timestamp(${period_start}), to_timestamp(${period_end}))
                ON CONFLICT (stripe_subscription_id) DO UPDATE
                SET status='active', current_period_start=to_timestamp(${period_start}), current_period_end=to_timestamp(${period_end})`
              );
            }
            break;
          }

          case 'invoice.paid': {
            const invoice = event.data.object;
            await db.query(
              `INSERT INTO "Invoice" (stripe_invoice_id, id_subscription, amount_paid, currency, status, hosted_invoice_url, invoice_pdf, created_at)
              VALUES (invoice.id, (SELECT id FROM "Subscription" WHERE stripe_customer_id=${invoice.customer}), ${invoice.amount_paid}, ${invoice.currency},
                      ${invoice.status}, ${invoice.hosted_invoice_url}, ${invoice.invoice_pdf}, to_timestamp(${invoice.created}))
              ON CONFLICT (stripe_invoice_id) DO UPDATE SET status=${invoice.status}`
            );
            break;
          }

          case 'customer.subscription.updated': {
            const subscription = event.data.object;
            await db.query(
              `UPDATE "Subscription"
              SET
                status=${subscription.status},
                current_period_start=to_timestamp(${subscription.current_period_start}),
                current_period_end=to_timestamp(${subscription.current_period_end})
              WHERE stripe_subscription_id=${subscription.id}`
            );
            break;
          }

          case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            await db.query(
              `UPDATE "Subscription"
              SET
                status='canceled',
                current_period_end=to_timestamp(NOW())
              WHERE stripe_subscription_id=${subscription.id}`
            );
            break;
          }

          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (err) {
        console.error('❌ Webhook handler failed:', err);
        res.status(500).send('Webhook handler error');
      }
    }
  }
};