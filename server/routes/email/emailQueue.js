module.exports = app => {
  'use strict';
  const express = require('express');
  const ctrl    = require('../../controllers/email/emailQueueCtrl')(app.locals.db);
  const router  = express.Router();

  router.post('/', ctrl.create);

  return router;
};
