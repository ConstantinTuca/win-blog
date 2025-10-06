module.exports = db => {
  'use strict';
  const { error: rh } = require('../authorization/requestHandler');
  const emailSender = require('./emailSender')(db, global.smtpTransportYour, global.smtpTransportAWS);
  const _ = require('lodash');
  const async = require('async');
  const fs = require('fs');
  const promise = require('node-promise').Promise;
  const dayjs = require('dayjs');

  function logError(user, action, err, res, req) {
    // let text = 'Data eroare: ' + (new Date()) + '\n\n Server side problems';
    // text += 'Acțiune: ' + action + '\n\nEroare: ' + err.toString();
    // emailSender.sendMailErr(text);

    console.error(err);
    const id_user = user ? user.id : 0;
    if (req?.params) {
      err.params = req.params;
    };
    if (req?.body) {
      err.body = req.body;
    };
    err.stackTrace = err.stack;
    err.user = {
      id_user: id_user
    };

    let detail = err ? JSON.stringify(err, null, 4) : '';
    detail = detail.replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\n\s/g, '\n        ');
    db.models.LogError.create({ id_user: id_user, action: action, error: err ? err.toString() : '', detail }).then(() => {
      if (res) {
        res.status(400);
        res.end();
      }
    }).catch(() => {
      if (res) {
        res.status(400);
        res.end();
      }
    });
  }

  function logAction(idUser, action, details, ip_address, isReport) {
    if (idUser) {
      db.models.LogAction.create({
        id_user: idUser,
        action: action,
        details: details,
        date: new Date(),
        ip_address: ip_address ? ip_address : '::1',
        is_report: (isReport !== null || isReport !== undefined ? isReport : null)
      }).catch(e => console.info('create logAction', e));
    }
  }

  function updateLastLogin(idUser, req) {
    if (idUser) {
      let tasks = [];

      tasks.push(cb => {
        db.query(`UPDATE "User" SET last_login = now() WHERE id = ${idUser}`).then(() => cb()).catch(e => cb(e));
      });

      tasks.push(cb => {
        let tmpIpAddress = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.socket.remoteAddress;
        // db.query(`UPDATE "LogAction" SET date = now(), details = details || ';' || now()::text WHERE action = 'LogIn' AND id_user = ${idUser}`).then(resp => {
        db.query(`UPDATE "LogAction" SET date = now(), details = now()::text, ip_address = '${tmpIpAddress}' WHERE action = 'LogIn' AND id_user = ${idUser}`).then(resp => {
          if (resp[1].rowCount > 0) {
            cb();
          } else {
            db.query(`INSERT INTO "LogAction" (action, date, details, "createdAt", "updatedAt", id_user, ip_address) VALUES ('LogIn', now(), now(), now(), now(), ${idUser}, ${tmpIpAddress})`).then(() => cb()).catch(e => cb(e));
          }
        }).catch(e => cb(e));
      });

      async.parallel(tasks, () => {
        return null;
      });
    }
  }

  function REPLACE_DIACRITICS(text) {
    return text ? text.toLowerCase().normalize('NFKD').replace(/[^\w]/g, '') : null;
  }

  function verifyEmail(req, res) {
    let error = null;
    let errorCase = null;

    if (req.body.email) {
      let email = req.body.email.replace(/\s/g, '').toLowerCase();
      db.query(`SELECT COUNT(email) FROM "User" WHERE LOWER(TRIM(email)) = '${email}' ${req.body.id ? `AND id <> ${req.body.id}` : ''}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp[0].count > 0) {
          error = 'Adresa de email există deja in baza de date!';
          errorCase = 'email';
          res.json({ error, errorCase });
        } else {
          res.send('success');
        }
      }).catch(e => logError(req.user, 'utils - verifiyEmail', e, res, req));
    }
  }

  function verifyUnitEmail(req, res) {
    let error = null;
    let errorCase = null;

    if (req.body.email) {
      let email = req.body.email.replace(/\s/g, '').toLowerCase();
      db.query(`SELECT COUNT(email) FROM "Unit" WHERE LOWER(TRIM(email)) = '${email}' ${req.body.id ? `AND id <> ${req.body.id}` : ''}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp[0].count > 0) {
          error = 'Adresa de email există deja in baza de date!';
          errorCase = 'unitEmail';
          res.json({ error, errorCase });
        } else {
          res.send('success');
        }
      }).catch(e => logError(req.user, 'utils - verifiyUnitEmail', e, res, req));
    } else {
      res.send('Email not found!');
    }
  }

  function verifyCui(req, res) {
    let error = null;
    let errorCase = null;

    if (req.body.cui) {
      db.query(`SELECT COUNT(cui) FROM "Unit" WHERE cui = ${req.body.cui} ${req.body.id ? `AND id <> ${req.body.id}` : ''}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp[0].count > 0) {
          error = 'CUI-ul unității există deja în baza de date!';
          errorCase = 'cui';
          res.json({ error, errorCase });
        } else {
          res.send('success');
        }
      }).catch(e => logError(req.user, 'utils - verifiyCui', e, res, req));
    } else {
      res.send('CUI not found!');
    }
  }

  function replaceRomanianChars(val) {
    const romanianChars = {
      'ă': 'a',
      'Ă': 'A',
      'â': 'a',
      'Â': 'A',
      'î': 'i',
      'Î': 'I',
      'ș': 's',
      'Ș': 'S',
      'ț': 't',
      'Ț': 'T'
    };
    return val.replace(/[ăĂâÂîÎșȘțȚ]/g, char => romanianChars[char] || char);
  }

  function verifyPersonEmail(req, res) {
    let error = null;
    let errorCase = null;

    if (req.params.email) {
      db.query(`SELECT COUNT(email) FROM "Person" WHERE email = '${req.params.email}' ${req.params.id ? `AND id <> ${req.params.id}` : ''}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp[0].count > 0) {
          error = 'Adresa de email există deja in baza de date!';
          errorCase = 'email';
        }
        if (error) {
          res.json({ error, errorCase });
        } else {
          res.send('success');
        }
      }).catch(e => logError(req.user, 'utils - verifiyPersonEmail', e, res, req));
    }
  }

  function createBlobFromFile(file) {
    const d = new promise();

    if (file) {
      fs.readFile(file.path, (er, data) => {
        if (er) {
          d.reject(er);
        } else {
          fs.unlink(file.path, e => {
            if (e) {
              d.reject(e);
            }
          });

          d.resolve(data);
        }
      });
    } else {
      d.reject('Error - File not found!');
    }

    return d;
  }

  function round(value, decimals) {
    if (decimals) {
      let factor = Math.pow(10, decimals);
      return Math.round(value * factor) / factor;
    } else {
      return Math.round(parseFloat(value.toFixed(2)));
    }
  }

  function getDaysBetween(start, end, freeDays, excludeFreeDays, excludeWeekend) {
    const arr = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
      arr.push(new Date(startDate));
    }

    if (freeDays.length && excludeFreeDays) {
      for (let ln = arr.length - 1, i = ln; i >= 0; i--) {
        for (let ln = freeDays.length - 1, j = ln; j >= 0; j--) {
          if (new Date(arr[i]).setHours(0, 0, 0, 0) === new Date(freeDays[j].date).setHours(0, 0, 0, 0)) {
            arr.splice(i, 1);
          }
        }
      }
    }

    if (excludeWeekend) {
      for (let ln = arr.length - 1, i = ln; i >= 0; i--) {
        if (new Date(arr[i]).getDay() === 6 || new Date(arr[i]).getDay() === 0) {
          arr.splice(i, 1);
        }
      }
    }

    return arr;
  }

  function getMonthsBetween(start, end, excludeEndMonth) {
    const arr = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (; startDate <= endDate; startDate.setMonth(startDate.getMonth() + 1)) {
      if (excludeEndMonth && dayjs(startDate).format('YYYY-MM') === dayjs(endDate).format('YYYY-MM')) {
        break;
      }

      arr.push(dayjs(startDate).format('YYYY-MM-DD'));
    }

    return arr;
  }

  function daysInMonth(date) {
    return new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate();
  }

  const monthsNameArr = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];

  return {
    /* ---------------------------------------------- NO DB utils ---------------------------------------------- */
    logError: logError,
    logAction: logAction,
    updateLastLogin: updateLastLogin,
    REPLACE_DIACRITICS: REPLACE_DIACRITICS,
    verifyPersonEmail: verifyPersonEmail,
    verifyEmail: verifyEmail,
    verifyUnitEmail: verifyUnitEmail,
    verifyCui: verifyCui,
    replaceRomanianChars: replaceRomanianChars,
    createBlobFromFile: createBlobFromFile,
    round: round,
    getDaysBetween: getDaysBetween,
    getMonthsBetween: getMonthsBetween,
    daysInMonth: daysInMonth,
    monthsNameArr: monthsNameArr,

    renderPdf: (ob, res, req) => {
      const renderer = require('../init/pdf')(req.app);
      renderer.renderer(ob, (err, pdfPath) => {
        if (err !== true) {
          logError(req.user, 'error render PDF', err, res, req);
        } else if (pdfPath) {
          res.download(pdfPath, '', err => {
            if (err) {
              logError(req.user, 'error download static pdf', err, res, req);
            }
            fs.unlink(pdfPath, errUnlink => {
              if (errUnlink) {
                logError(req.user, 'error unlink static pdf file', errUnlink, res, req);
              }
            });
          });
        } else {
          rh(res, 'No pdf path found', err);
        }
      });
    },

    renderMultiplePdf: (ob, res, req) => {
      const renderer = require('../init/pdf')(req.app);
      const p = new promise();
      renderer.renderer(ob, (err, pdfPath, html) => {
        if (err !== true) {
          p.reject(err);
        } else if (pdfPath) {
          p.resolve({ pdfPath, html });
        } else {
          p.reject(err);
        }
      });
      return p;
    },

    randomString: (len, charSet) => {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var randomString = '';
      for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
      }
      return randomString;
    },

    getHandlebar: (unit, template) => {
      let d = new promise(), t = [], response = {}, condition = unit && unit.id ? 'AND hj.id_unit = ' + unit.id : '';

      db.query(`SELECT ht.content, ht.orientation, ht.disable_footer, ht.footer_height
      FROM "HandlebarTemplate" ht
      LEFT JOIN "HandlebarJunction" hj ON hj.id_handle = ht.id
      WHERE ht.template = '${template}' ${condition}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp.length) {
          response.template = resp[0];
          d.resolve(response);
        } else {
          // cb(`template ${template} not found`);
          d.reject(`template ${template} not found`);
        }
      }).catch(e => d.reject(e));
      return d;
    },
  };
};
