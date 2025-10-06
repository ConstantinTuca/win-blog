module.exports = app => {
    'use strict';
    const express    = require('express');
    const clientCtrl = require('../../controllers/user/clientCtrl')(app.locals.db);
    const router     = express.Router();

    /* CLIENT */
    router.post('/', clientCtrl.create);
    router.post('/setImageProfile', clientCtrl.setImageProfile);
    router.post('/verifyOldPassword', clientCtrl.verifyOldPassword);
    router.post('/reset/password', clientCtrl.resetPassword);
    router.put('/', clientCtrl.update);
    router.get('/:id_user', clientCtrl.find);
    router.delete('/:id_user', clientCtrl.destroy);

    return router;
  };
