module.exports = db => {
  const logError    = require('../../utils/utils')(db).logError;

  return {

    find: (req, res) => {
      db.query(`SELECT p.*
        , f.file_blob, TO_JSON(f.*) AS post_pic
        FROM "Post" p
        LEFT JOIN "File" f ON f.id = p.id_file
        WHERE p.id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r.length ? r[0] : {});
      }).catch(e => logError(req.user, `postCtrl - findAll`, e, res, req));
    },

    findAll: (req, res) => {
      db.query(`SELECT p.*
        , f.file_blob, TO_JSON(f.*) AS post_pic
        FROM "Post" p
        LEFT JOIN "File" f ON f.id = p.id_file
        ORDER BY p.id DESC`, { type: db.QueryTypes.SELECT }).then(r => {
        res.json(r);
      }).catch(e => logError(req.user, `postCtrl - findAll`, e, res, req));
    }
  };
}