module.exports = app => {
    'use strict';
    const express    = require('express');
    const postCtrl = require('../../controllers/admin/postCtrl')(app.locals.db);
    const router     = express.Router();

    router.post('/', postCtrl.create);
    router.post('/uploadFile', postCtrl.uploadFile);

    router.put('/', postCtrl.update);

    router.get('/findAll', postCtrl.findAll);
    router.get('/find/:id', postCtrl.find);

    router.delete('/:id', postCtrl.destroy);

    return router;
  };
