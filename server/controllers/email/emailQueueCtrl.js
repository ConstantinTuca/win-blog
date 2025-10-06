module.exports = db => {
  const {success: rhs} = require('../../authorization/requestHandler');
  const logError       = require('../../utils/utils')(db).logError;

  return {
    create: (req, res) => {
      db.models.EmailQueue.bulkCreate(req.body).then(() => {
        rhs(res);
      }).catch(e => logError(req.user, 'emailQueueCtrl - create', e, res, req))
    },
  };
};
