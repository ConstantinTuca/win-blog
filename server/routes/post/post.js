module.exports = app => {
  'use strict';
  const express    = require('express');
  const postCtrl = require('../../controllers/post/postCtrl')(app.locals.db);
  const router     = express.Router();

  router.get('/findAll', postCtrl.findAll);
  router.get('/find/:id', postCtrl.find);

  return router;
};
