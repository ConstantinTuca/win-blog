module.exports = app => {
  'use strict';
  const router     = require('express').Router();
  const _          = require('lodash');
  const jwt        = require('jsonwebtoken');
  const jwtRefresh = require('jsonwebtoken-refresh');

  router.get('/', (req, res) => {
    let token = req.headers['x-access-token'] || req.body.token || req.params.token;
    if (token) {
      jwt.verify(token, app.locals.config.sKey, function checkToken(err) {
        if (!err) {
          let obj = jwt.decode(token, {complete: true});
          res.send({token: jwtRefresh.refresh(obj, 86400, app.locals.config.sKey, null)});
        } else {
          res.send({token: null});
        }
      });
    } else {
      res.send({token: null});
    }
  });

  router.post('/updateToken', (req, res) => {
    console.log('ssssss')
    let logError = require('../utils/utils')(app.locals.db).logError;
    let token = req.headers['x-access-token'] || req.body.token || req.params.token, response = null;

    if (token) {
      jwt.verify(token, app.locals.config.sKey, function checkToken(err) {
        if (err) {
          logError(req.user, 'Update token updateEmployee', err, res, req);
        } else {
          let obj = jwt.decode(token, {complete: true});
          let ob = _.extend(obj.payload, req.body);
          delete ob.iat;
          delete ob.exp;
          res.send({token: jwt.sign(ob, app.locals.config.sKey, {expiresIn: 86400})});
        }
      });
    } else {
      res.send({token: response});
    }
  });


  router.post('/updateTokenLogin', (req, res) => {
    let logError = require('../utils/utils')(app.locals.db).logError;
    let token = req.headers['x-access-token'] || req.body.token || req.params.token, response = null;

    if (token) {
      jwt.verify(token, app.locals.config.sKey, function checkToken(err) {
        if (err) {
          logError(req.user, 'Update token updateEmployee', err, res, req);
        } else {
          res.send({token: jwt.sign(req.body, app.locals.config.sKey, {expiresIn: 86400})});
        }
      });
    } else {
      res.send({token: response});
    }
  });

  // router.put('/', (req, res) => {
  //   let token = req.headers['x-access-token'] || req.body.token || req.params.token, response = null;
  //   if (token) {
  //     jwt.verify(token, app.locals.config.sKey, function checkToken(err) {
  //       if (!err) {
  //           res.send({token: jwt.sign(req.body, app.locals.config.sKey, {expiresIn: 86400})});
  //       } else {
  //         res.send({token: response});
  //       }
  //     });
  //   } else {
  //     res.send({token: response});
  //   }
  // });

  // router.post('/updateTaxPlayer', (req, res) => {
  //   let logError = require('../utils/utils')(app.locals.db).logError;
  //   let token = req.headers['x-access-token'] || req.body.token || req.params.token, response = null;
  //   if (token) {
  //     jwt.verify(token, app.locals.config.sKey, function checkToken(err) {
  //       if (err) {
  //         logError(req.user, 'Update token updateTaxPlayer', err, res, req);
  //       } else {
  //         app.locals.db.query(`UPDATE "User" SET id_tax_payer = ${req.body.id_tax_payer} WHERE id = ${req.user.id}`).then(()=>{
  //           let obj = jwt.decode(token, {complete: true});
  //           let ob = _.extend(obj.payload, req.body);
  //           delete ob.iat;
  //           delete ob.exp;
  //           res.send({token: jwt.sign(ob, app.locals.config.sKey, {expiresIn: 86400})});
  //         }).catch(e=>logError(req.user, 'Update user id_tax_player', e, res, req));
  //       }
  //     });
  //   } else {
  //     res.send({token: response});
  //   }
  // });

  return router;
};
