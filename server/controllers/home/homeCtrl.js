module.exports = db => {
  const logError       = require('../../utils/utils')(db).logError;
  const async = require('async');

  return {
    findCounters: (req, res) => {
      async.parallel({
        landsForSale: cb => {
          db.query(`SELECT COUNT(a.id) AS counter
            FROM "Ad" a
            WHERE a.deleted IS NOT TRUE`, {type: db.QueryTypes.SELECT}).then(r => cb(null, (r.length ? r[0].counter : 0))).catch(e => cb(e));
        }
      }, (err, resp) => {
        if(err) {
          logError(req.user, 'homeCtrl - findCounters', err, res, req)
        } else {
          res.send(resp);
        }
      });
    }
  };
};