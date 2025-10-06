module.exports = app => {
    'use strict';
    const express    = require('express');
    const errorsCtrl = require('../../controllers/admin/errorsCtrl')(app.locals.db);
    const router     = express.Router();

    router.post('/findAll', errorsCtrl.findAll);
    router.post('/delete/:id_error', errorsCtrl.delete);
    router.get('/find/:id', errorsCtrl.find);

    return router;
  };
