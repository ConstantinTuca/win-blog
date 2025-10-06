module.exports = db => {
  const async       = require('async');
  const logError    = require('../../utils/utils')(db).logError;
  const logAction   = require('../../utils/utils')(db).logAction;
  const {success: rhs} = require('../../authorization/requestHandler');

  return {

    findAll: (req, res) => {
      async.parallel({
        errors: cb => {
          db.query(`SELECT e.id, e.action, e.error, e.detail, e.id_user, e."createdAt", u.email
            FROM "LogError" e
            LEFT JOIN "User" u ON u.id = e.id_user`, { type: db.QueryTypes.SELECT }).then(r => cb(null, r)).catch(e => cb(e));
        }
      }, (e, r) => {
        if (e) {
          logError(req.user, 'errorsCtrl - findAll', e, res, req);
        } else {
          res.json(r);
        }
      });
    },

    find: (req, res) => {
      db.query(`SELECT l.id_user, u.email, CONCAT(u.last_name, ' ', u.first_name) AS user_name, l.action, l.error, l.detail, TO_CHAR(l."createdAt", 'dd.MM.yyyy - HH:mm' ) as "createdAt"
      FROM "LogError" l
      LEFT JOIN "User" u ON u.id = l.id_user
      WHERE l.id = ${req.params.id}`, {type: db.QueryTypes.SELECT}).then(resp => res.send(resp[0])).catch(e => logError(req.user, 'errorCtrl - find', e, res, req));
    },

    delete: (req, res) => {
      db.query(`DELETE FROM "LogError" WHERE id = ${req.params.id_error}`, { type: db.QueryTypes.SELECT }).then(() => {
        logAction(req.user.id, 'errorsCtrl - destroy', `Delete logError - id: ${req.params.id_error}`);
        rhs(res);
      }).catch(e => logError(req.user, 'errorsCtrl - destroy', e, res, req));
    }
  };
}