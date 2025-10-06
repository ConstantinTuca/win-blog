module.exports = app => {
    'use strict';
    const express    = require('express');
    const winnerCtrl = require('../../controllers/admin/winnerCtrl')(app.locals.db);
    const router     = express.Router();

    router.post('/', winnerCtrl.create);

    router.put('/', winnerCtrl.update);

    router.get('/findAll', winnerCtrl.findAll);
    router.get('/findUsers', winnerCtrl.findUsers);
    router.get('/find/:id', winnerCtrl.find);

    router.delete('/:id', winnerCtrl.destroy);

    return router;
  };
