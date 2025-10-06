module.exports = db => {
  const {success: rhs} = require('../../authorization/requestHandler');
  const logError       = require('../../utils/utils')(db).logError;
  const hashPwd = require('../../authorization/authentication').hashPwd;
  const logAction      = require('../../utils/utils')(db).logAction;
  const async = require('async');
  const fs = require('fs');

  return {
    create: (req, res) => {
      db.models.User.create(req.body).then(({ id, first_name, last_name }) => {
        logAction(req.user.id, 'Creare utilizator', `Creare utilizator - tip utilizator: Client, nume: ${first_name} ${last_name}, cu <b>id: ${id}</b>`, req.user.ip_address);
        res.send({ id });
      }).catch(e => logError(req.user, 'clientCtrl - create client', e, res, req));
    },

    update: (req, res) => {
      db.models.User.update(req.body, {where: {id: req.body.id}}).then(() => {
        logAction(req.user.id, 'clientCtrl - update', `Actualizare user - id: ${req.body.id}`);
        rhs(res);
      }).catch(e => logError(req.user, `update user, id: ${req.body.id}`, e, res, req));
    },

    find: (req, res) => {
      db.query(`SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.description, validated_email, f.file_blob, TO_JSON(f.*) AS profile_pic
        FROM "User" u
        LEFT JOIN "File" f ON f.id_user = u.id AND f.profile_image IS true
        WHERE u.id = ${req.params.id_user}`, { type: db.QueryTypes.SELECT }).then(r => {
        res.send(r[0]);
      }).catch(e => logError(req.user, `find clientCtrl - find, id_user: ${req.params.id_user}`, e, res));
    },

    verifyOldPassword: (req, res) => {
      db.query(`SELECT id, salt, password FROM "User" WHERE id = ${req.body.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp.length) {
          const user = resp[0];
          const password = hashPwd(user.salt, req.body.password);
          if (password === user.password) {
            res.send({ valid: true });
          } else {
            res.send({ valid: false });
          }
        } else {
          logError(req.user, 'clientCtrl - verifyOldPassword User - select salt', 'not found', res, req);
        }
      }).catch(e => logError(req.user, 'clientCtrl - verifyOldPassword User - select salt', e, res, req));
    },

    resetPassword: (req, res) => {
      db.query(`SELECT id, salt, email FROM "User" WHERE id = ${req.body.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp.length) {
          const password = req.body.password, user = resp[0];
          db.models.User.update({ password: hashPwd(user.salt, password) }, { where: { id: user.id } }).then(() => {
            logAction(req.body.id, 'clientCtrl - resetPassword', `Resetare parola - parola: ${req.body.password}`, null);
            rhs(res);
          }).catch(e => logError(req.user, 'clientCtrl - resetPassword User', e, res, req));
        } else {
          logError(req.user, 'clientCtrl - resetPassword User - select salt', 'not found', res, req);
        }
      }).catch(e => logError(req.user, 'clientCtrl - resetPassword User - select salt', e, res, req));
    },

    setImageProfile: (req, res) => {
      db.query(`SELECT id
        FROM "File"
        WHERE id_user = ${req.user.id} AND profile_image IS TRUE`, {type: db.QueryTypes.SELECT}).then(resp => {
          if (resp.length) {
            let id = resp[0].id
            db.query(`DELETE FROM "File" WHERE id = ${id} `, {type: db.QueryTypes.SELECT}).then(() => {
              saveProfileImage(req, res);
            }).catch(e => logError(req.user, 'clientCtrl - setImageProfile delete file', e, res, req));
          } else {
            saveProfileImage(req, res);
          }
      }).catch(e => logError(req.user, `clientCtrl - setImageProfile find exist`, e, res, req));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "User" WHERE id = ${req.params.id_user} RETURNING first_name, last_name`, {type: db.QueryTypes.SELECT}).then(resp => {
        logAction(req.user.id, 'delete user', `delete user, id: ${req.params.id_user}, name: ${resp.first_name} ${resp.last_name}`);
        rhs(res);
      }).catch(e => logError(req.params.id_user, `clientCtrl - destroy, id_user: ${req.params.id_user}`, e, res, req));
    }
  };

  function saveProfileImage(req, res) {
    if (req.files && req.files.length) {
      let t = [], fileIds = [];
      let error_message = '';

      for (let i = 0; i < req.files.length; i++) {
        t.push(cb => {
          let ob = {
            id_user: req.user.id,
            profile_image: true
          };

          fs.readFile(req.files[i].path, (er, data) => {
            if (er) {
              error_message = 'create File - read';
              return cb(er);
            } else {
              // Check if the file exists before attempting to delete
              fs.promises.access(req.files[i].path, fs.constants.F_OK)
                .then(() => {
                  // File exists, proceed to unlink it
                  fs.unlink(req.files[i].path, e => {
                    if (e) {
                      error_message = req.files[i].path + ' - unlink file, replace file';
                      return cb(e);
                    }
                  });
                })
                .catch(() => {
                  // File doesn't exist, log a warning and continue
                  console.warn(`File not found at path: ${req.files[i].path}`);
                });

              // Process the file information
              let extension = req.files[i].originalname.split('.').pop().toLowerCase();
              ob.name = req.files[i].originalname.replace('.' + extension, '');
              ob.extension = extension;
              ob.file_blob = data;

              // Save the file record to the database
              db.models.File.create(ob).then(f => {
                fileIds.push(f.id);
                cb();
              }).catch(e => {
                error_message = 'create File';
                cb(e);
              });
            }
          });
        });
      }

      // Use async.parallel to run the file handling concurrently
      async.parallel(t, e => {
        if (e) {
          logError(req.user, 'setImageProfile async - clientCtrl', e, res);
        } else {
          res.send();
        }
      });
    }
  };
};