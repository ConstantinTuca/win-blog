module.exports = app => {
  'use strict';
  const express    = require('express');
  const subscriptionCtrl = require('../../controllers/admin/subscriptionCtrl')(app.locals.db);
  const router     = express.Router();

  router.post('/cancel', subscriptionCtrl.cancel);
  router.post('/refund', subscriptionCtrl.refund);

  router.get('/findAll', subscriptionCtrl.findAll);
  router.get('/find/:id', subscriptionCtrl.find);

  return router;
};
