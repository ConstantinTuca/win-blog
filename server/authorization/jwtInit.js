module.exports = app => {
  'use strict';
  const jwt = require('jsonwebtoken');
  const router = require('express').Router();
  const updateLastLogin = require('../utils/utils')(app.locals.db).updateLastLogin;
  const authenticate = require('./authentication').authenticate;
  const hashPwd = require('./authentication').hashPwd;
  const logError = require('../utils/utils')(app.locals.db).logError;
  const { success: rhs } = require('../authorization/requestHandler');
  const emailSender = require('../utils/emailSender')(app.locals.db);

  function render(res, user, req) {
    delete user.salt;
    delete user.password;

    user.token = jwt.sign({ id: user.id }, app.locals.config.sKey, { expiresIn: 86400 });
    updateLastLogin(user.id, req);
    res.json(user);
  }

  function completeAuthentication(req, res) {
    app.locals.db.query(`SELECT id, first_name, last_name, email, role, active, password, salt, uuid,
    gdpr, validated_email, phone,
    DATE("createdAt") AS date_created
    FROM "User"
    WHERE LOWER(TRIM(email)) = '${req.body.email}'`, { type: app.locals.db.QueryTypes.SELECT }).then(user => {
      user[0].ip_address = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.socket.remoteAddress;

      render(res, user[0], req);

    }).catch(e => {
      console.error('Autentificare eșuată', e);
      res.json({ success: false, message: 'Autentificare eșuată!' });
    });
  }

  router.post('/login', (req, res) => {
    let d = new RegExp('"', 'g');
    let q = new RegExp('\'', 'g');
    let email = req.body.email.toLowerCase().replace(d, '').replace(q, '').replace(/\s/g, '');
    let email_regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,5}$/;

    if (email_regex.test(email)) {
      req.body.email = req.body.email.replace(/\s/g, '').toLowerCase();
      app.locals.db.query(`SELECT u.active, u.salt, u.password
      FROM "User" u
      WHERE LOWER(TRIM(u.email)) = '${req.body.email}'`, { type: app.locals.db.QueryTypes.SELECT }).then(user => {
        if (user.length) {
          if (user[0].active) {
            if (authenticate(req.body.password, user[0].salt, user[0].password)) {
              completeAuthentication(req, res);
            } else {
              res.json({ success: false, message: 'Autentificare eșuată. Parolă greșită!' });
            }
          } else {
            res.json({ success: false, message: 'Contul este dezactivat!' });
          }
        } else {
          res.json({ success: false, message: 'Utilizator inexistent!' });
        }
      }).catch(e => {
        console.error('Autentificare eșuată', e);
        res.json({ success: false, message: 'Autentificare eșuată!' });
      });
    } else {
      res.json({ success: false, message: 'Adresa de email nu este validă!' });
    }
  });

  router.post('/checkUserDetails', (req, res) => {
    app.locals.db.query(`SELECT first_name, last_name, email, phone, validated_email, gdpr
    FROM "User"
    WHERE id = ${req.body.id}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
      res.send(r.length ? r[0] : {});
    })
  });

  /** Part for RESET PASSWORD */
  router.post('/checkUserByEmail', (req, res) => {
    let email = req.body.email.replace(/\s/g, '').toLowerCase();
    app.locals.db.query(`SELECT id, first_name, last_name, role, active, password, salt, uuid, gdpr
    FROM "User"
    WHERE LOWER(TRIM(email)) = '${email}'`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
      if (r.length) {
        res.send({ user: r[0], found: true });
      } else {
        res.send({ user: null, found: false });
      }
    })
  });

  router.post('/sendEmailResetPassword', (req, res) => {
    let access_token = jwt.sign(req.body.user, app.locals.config.sKey, { expiresIn: 86400 });

    const options = { access_token, email: req.body.email }
    emailSender.sendMailResetPassword(req.body.user.id, options).then(() => {
      rhs(res);
    }).catch(e => {
      logError(req.body.user, 'jwtInit - sendEmailResetPassword', e, res, req);
    });
  });

  router.post('/checkIdUserByResetToken', (req, res) => {
    jwt.verify(req.body.token, app.locals.config.sKey, function checkToken(err, decoded) {
      if (err) {
        res.send({ id_user: null, found: false });
      } else {
        res.send({ id_user: decoded.id, found: true });
      }
    });
  });

  router.post('/resetPassword', (req, res) => {
    app.locals.db.query(`SELECT email, password, salt, active
      FROM "User"
      WHERE id = '${req.body.id_user}'`, { type: app.locals.db.QueryTypes.SELECT }).then(user => {
      if (user.length) {
        app.locals.db.query(`UPDATE "User" SET password = '${hashPwd(user[0].salt, req.body.password)}' WHERE id = ${req.body.id_user}`).then(() => {
          res.send({ success: true, message: 'Parola a fost schimbată cu succes' });
        }).catch(e => console.log('e: ', e));
      } else {
        res.send({ success: false, message: 'Utilizator inexistent' });
      }
    }).catch(e => {
      res.send({ success: false, message: 'Eroare la schimbarea parolei' });
    });
  });
  /** END Part for RESET PASSWORD */

  /** Part for VALIDATE EMAIL */
    router.post('/sendEmailValidation', (req, res) => {
      let access_token = jwt.sign(req.body.user, app.locals.config.sKey, { expiresIn: 86400 });

      const options = { access_token, email: req.body.email }
      emailSender.sendMailValidateEmail(req.body.user.id, options).then(() => {
        rhs(res);
      }).catch(e => {
        logError(req.body.user, 'userCtrl - sendEmailValidation (sa)', e, res, req);
      });
    });

    router.post('/checkIdUserByValidationToken', (req, res) => {
      jwt.verify(req.body.token, app.locals.config.sKey, function checkToken(err, decoded) {
        if (err) {
          res.send({ id_user: null, found: false });
        } else {
          res.send({ id_user: decoded.id, found: true });
        }
      });
    });

    router.post('/validateEmail', (req, res) => {
      app.locals.db.query(`SELECT validated_email FROM "User"
        WHERE id = '${req.body.id_user}'`, { type: app.locals.db.QueryTypes.SELECT }).then(user => {
        if (user.length) {
          if (user[0].validated_email) {
            res.send({ success: false, message: 'Adresa de email este deja validată!' });
          }
          else {
            app.locals.db.query(`UPDATE "User" SET validated_email = true WHERE id = ${req.body.id_user}`).then(() => {
              res.send({ success: true, message: 'Adresa de email a fost validată cu succes!' });
            }).catch(e => console.log('e: ', e));
          }
        } else {
          res.send({ success: false, message: 'Utilizator inexistent!' });
        }
      }).catch(() => {
        res.send({ success: false, message: 'Eroare la validarea adresei de email!' });
      });
    });
  /** END Part for VALIDATE EMAIL */

  return router;
};
