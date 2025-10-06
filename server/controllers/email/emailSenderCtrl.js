module.exports = db => {
  const {success: rhs} = require('../../authorization/requestHandler');
  const emailSender = require('../../utils/emailSender')(db, global.smtpTransportAWS);

  return {
    createContactEmail: (req, res) => {
      const id_user = req.user && req.user.id ? req.user.id : 1;
      emailSender.sendMailContact(id_user, req.body);

      if (req.user) logAction(id_user, 'contactCtrl - createContactEmail');
      rhs(res);
    },
  };
};
