module.exports = db => {
  const {success: rhs} = require('../../authorization/requestHandler');
  const logError       = require('../../utils/utils')(db).logError;
  // const hashPwd = require('../../authorization/authentication').hashPwd;
  const async = require('async');

  return {
    create: (req, res) => {
      db.models.User.create(req.body).then(({ id, first_name, last_name }) => {
        // logAction(req.user.id, 'Creare utilizator', `Creare utilizator - tip utilizator: Client, nume: ${first_name} ${last_name}, cu <b>id: ${id}</b>`, req.user.ip_address);
        res.send({ id });
      }).catch(e => logError(req.user, 'clientGuests - create client', e, res, req));
    }
  };
};
