exports.createTransport = config => {
	let nodemailer = require('nodemailer');
      return nodemailer.createTransport({
        host: 'mail.lands.ro',
        port: 465,
        secure: true,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: 'office@lands.ro',
          pass: '#DLE4LZ8gwfU'
        }
    });
};