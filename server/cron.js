module.exports = app => {
  const cron = require('node-cron');
  const async = require('async');
  const https = require('https');
  const _ = require('lodash');


  // if (process.env.NODE_ENV === 'production') {
    const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
    const sesClient = new SESClient({
      region: 'eu-west-3',
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
      }
    });

    cron.schedule('*/3 * * * * *', () => {
      console.log('This cron job is running every 3 seconds to check for any emails to be sent in the emailQueue');

      app.locals.db.query('SELECT * FROM "EmailQueue" ORDER BY id LIMIT 10', { type: app.locals.db.QueryTypes.SELECT }).then((resp) => {
        if (resp.length) {
          if (!resp[0].status) {
            let idsEmails = resp.map(email => email.id);

            app.locals.db.query(`UPDATE "EmailQueue" SET status = 1 WHERE id IN (${idsEmails})`, { type: app.locals.db.QueryTypes.SELECT }).then(() => {
              let t = [];
              for (let row of resp) {
                if (row.email && row.subject && row.content) {
                  t.push(cb => {
                    const sendEmailCommand = new SendEmailCommand({
                      Source: 'Landvesto <no-reply@landvesto.com>',
                      Destination: {
                        ToAddresses: [row.email]
                      },
                      Message: {
                        Subject: { Data: row.subject },
                        Body: {
                          Html: { Data: row.content },
                        }
                      }
                    });

                    sesClient.send(sendEmailCommand).then(() => {
                      //IF sent succesfully then delete from EmailQueue
                      app.locals.db.query(`DELETE FROM "EmailQueue" WHERE id = ${row.id}`).then(() => {
                        cb();
                      }).catch(err => cb(err));
                    })
                    .catch((e) => {
                      console.log(e)
                      // //SET status failed (-1) for failed emails
                      // app.locals.db.query(`UPDATE "EmailQueue" SET status = -1 WHERE id = ${row.id}`).then(() => {
                      app.locals.db.query(`DELETE FROM "EmailQueue" WHERE id = ${row.id}`).then(() => {
                        cb();
                      }).catch(err => cb(err));
                    });
                  });
                }
              }
              async.series(t, e => {
                if (e) {
                  console.log('Error at sending emails from cron job', e);
                } else {
                  console.log('The emails was sent succesfully with the help of cron job!');
                }
              })
            }).catch(err => {
              console.log('Error at updating status of the emails: ', err);
            })
          } else {
            const counter = !resp[0].retry_counter ? 1 : resp[0].retry_counter + 1;
            if (counter > 2) {
              app.locals.db.query(`DELETE FROM "EmailQueue" WHERE id = ${resp[0].id}`).then(() => { }).catch(err => console.log('Error on the deleting of the email : ', err));
            } else {
              app.locals.db.query(`UPDATE "EmailQueue" SET retry_counter = ${counter} WHERE id = ${resp[0].id}`).then(() => { }).catch(err => console.log('Error at the update of the retry_counter of the email : ', err));
            }
          }
        }
      }).catch(err => {
        console.log('Error on bringing data from table EmailQueue: ', err);
      })
    });
  // }
}