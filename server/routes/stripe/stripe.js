module.exports = app => {
  'use strict';
  const express    = require('express');
  const stripeCtrl = require('../../controllers/stripe/stripeCtrl')(app.locals.db);
  const router     = express.Router();

  // Stripe requires raw body parsing for signature validation
  router.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeCtrl.handleWebhook);

  return router;
};
