module.exports = db => {
  const fs = require('fs');
  const logError    = require('../../utils/utils')(db).logError;
  const logAction   = require('../../utils/utils')(db).logAction;
  const {success: rhs} = require('../../authorization/requestHandler');

  return {

    uploadFile: (req, res) => {
      let ob = { id_user: req.user.id, name: req.body.name, file_name: req.body.title, date: req.body.publish_date };
      fs.readFile(req.files[0].path, (er, data) => {
        if (er) {
          logError(req.user, 'create File - read', er, res);
        } else {
          fs.unlink(req.files[0].path, e => {
            if (e) {
              logError(req.user, req.files[0].path + ' - unlink file, replace file', e);
            }
          });
          let extension = req.files[0].originalname.split('.').pop().toLowerCase();
          ob.name = req.files[0].originalname.replace('.' + extension, '');
          ob.extension = extension;
          ob.file_blob = data;
          ob.blog_post = true;
        }
        if(req.body.id_file) {
          db.models.File.update(ob, {where: {id: req.body.id_file}}).then(r => {
            logAction(req.user.id, 'Update file', `Update file - <b>id: ${r.id}</b>, for a blog post`);
            res.json(r);
          }).catch(e => logError(req.user, `updateFile File, id: ${req.body.id}`, e, res));
        } else {
          db.models.File.create(ob).then(r => {
            logAction(req.user.id, 'Add file', `Add file - <b>id: ${r.id}</b>, for a blog post`);
            res.json(r);
          }).catch(e => logError(req.user, 'createFile - post', e, res));
        }
      });
    },

    create: (req, res) => {
      db.models.Post.create(req.body).then(() => {
        logAction(req.user.id, 'postCtrl - create', `Create Ad`);
        rhs(res);
      }).catch(err => {
        logError(req.user, 'postCtrl - create', err, res, req);
      });
    },

    update: (req, res) => {
      db.models.Post.update(req.body, {where: {id: req.body.id}}).then(() => {
        logAction(req.user.id, 'postCtrl - update', `Update post - id: ${req.body.id}`);
        rhs(res);
      }).catch(e => logError(req.user, `postCtrl - update, id: ${req.body.id}`, e, res, req));
    },

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
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "Post" WHERE id = ${req.params.id} RETURNING title`, {type: db.QueryTypes.SELECT}).then(resp => {
        logAction(req.user.id, 'delete post', `delete post, id: ${req.params.id}, title: ${resp.title}`);
        rhs(res);
      }).catch(e => logError(req.user, `postCtrl - destroy, id: ${req.params.id}`, e, res, req));
    }
  };
}