module.exports = app => {
  'use strict';
  const express    = require('express');
  const winnerCtrl = require('../../controllers/winner/winnerCtrl')(app.locals.db);
  const router     = express.Router();

  router.get('/findAll', winnerCtrl.findAll);

  return router;
};
