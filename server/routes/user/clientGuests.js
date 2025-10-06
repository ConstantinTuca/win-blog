module.exports = app => {
    'use strict';
    const express    = require('express');
    const clientGuestsCtrl = require('../../controllers/user/clientGuestsCtrl')(app.locals.db);
    const router     = express.Router();

    /* CLIENT */
    router.post('/', clientGuestsCtrl.create);

    return router;
  };
