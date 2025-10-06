module.exports = app => {
  'use strict';
  const express    = require('express');
  const homeCtrl = require('../../controllers/home/homeCtrl')(app.locals.db);
  const router     = express.Router();

  router.get('/counters', homeCtrl.findCounters);

  return router;
};
