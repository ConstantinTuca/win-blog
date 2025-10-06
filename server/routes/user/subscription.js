module.exports = app => {
  'use strict';
  const express    = require('express');
  const subscriptionCtrl = require('../../controllers/user/subscriptionCtrl')(app.locals.db);
  const router     = express.Router();

  router.post('/subscribe', subscriptionCtrl.subscribe);
  router.post('/portal', subscriptionCtrl.portal);
  router.post('/cancel', subscriptionCtrl.cancel);

  router.get('/find/:id_user', subscriptionCtrl.find);

  return router;
};
