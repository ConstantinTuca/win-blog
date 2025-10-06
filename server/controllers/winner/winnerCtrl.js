module.exports = db => {
  const logError    = require('../../utils/utils')(db).logError;

  return {

    findAll: (req, res) => {
      db.query(`SELECT w.*
        FROM "Winner" w`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r);
      }).catch(e => logError(req.user, `winnerCtrl - findAll`, e, res, req));
    }
  };
}