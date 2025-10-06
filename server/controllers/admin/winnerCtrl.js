module.exports = db => {
  const logError    = require('../../utils/utils')(db).logError;
  const logAction   = require('../../utils/utils')(db).logAction;
  const {success: rhs} = require('../../authorization/requestHandler');

  return {
    create: (req, res) => {
      db.models.Winner.create(req.body).then(() => {
        logAction(req.user.id, 'winnerCtrl - create', `Create Winner`);
        rhs(res);
      }).catch(err => {
        logError(req.user, 'winnerCtrl - create', err, res, req);
      });
    },

    update: (req, res) => {
      db.models.Winner.update(req.body, {where: {id: req.body.id}}).then(() => {
        logAction(req.user.id, 'winnerCtrl - update', `Update winner - id: ${req.body.id}`);
        rhs(res);
      }).catch(e => logError(req.user, `winnerCtrl - update, id: ${req.body.id}`, e, res, req));
    },

    find: (req, res) => {
      db.query(`SELECT w.*
        FROM "Winner" w
        WHERE w.id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r.length ? r[0] : {});
      }).catch(e => logError(req.user, `winnerCtrl - findAll`, e, res, req));
    },

    findAll: (req, res) => {
      db.query(`SELECT w.*
        FROM "Winner" w`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r);
      }).catch(e => logError(req.user, `winnerCtrl - findAll`, e, res, req));
    },

    findUsers: (req, res) => {
      db.query(`SELECT u.id, COALESCE(u.first_name, ' ', u.last_name) AS full_name
        FROM "User" u
        WHERE u.role != 'sa'`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r);
      }).catch(e => logError(req.user, `winnerCtrl - findUsers`, e, res, req));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "Winner" WHERE id = ${req.params.id} RETURNING full_name`, {type: db.QueryTypes.SELECT}).then(resp => {
        logAction(req.user.id, 'delete winner', `delete winner, id: ${req.params.id}, full_name: ${resp.full_name}`);
        rhs(res);
      }).catch(e => logError(req.user, `winnerCtrl - destroy, id: ${req.params.id}`, e, res, req));
    }
  };
}