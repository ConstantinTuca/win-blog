module.exports = app => {
  'use strict';
  const express = require('express');
  const ctrl    = require('../../controllers/email/emailSenderCtrl')(app.locals.db);
  const router  = express.Router();

  router.post('/contact', ctrl.createContactEmail);

  return router;
};
