module.exports = (db, smtpTransportAWS) => {
  'use strict';

  let htmlTop = `<div width="100%" height="100%" style="height:100%;margin:0;padding:0;width:100%">
                  <table
                    style="border-collapse:separate;width:100%;min-width:100%;font-size:14px;font-family:Roboto,Arial,sans-serif;background-color:rgb(225,227,226);padding:40px 0px"
                    width="100%" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td>
                          <center>
                            <table
                              style="width:100%;margin:0px auto;float:none;border:0px none rgb(255,255,255);max-width:680px;background-color:rgb(255,255,255)"
                              align="center" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td>
                                    <table
                                      style="padding:15px 20px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table"
                                      cellpadding="0" cellspacing="0">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <table
                                              style="margin:0px auto;float:left;border:0px none rgb(255,255,255);padding:0px;max-width:67px"
                                              align="left" cellpadding="0" cellspacing="0">
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <a style="text-decoration:none; font-size: 34px; font-weight: bold;"><span style="color: #226e36; font-size: 34px;">Land</span><span style="color: #000000; font-size: 34px;">Vesto</span></a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table cellpadding="0" cellspacing="0"
                                      style="padding:0px 10px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                                              style="min-width:100%;max-width:100%;width:100%;min-height:1px">
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style="height:1px;width:100%;min-width:100%;line-height:1px;font-size:1px;background-color:rgb(164,164,164)">
                                                    <br>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      style="padding:13px 20px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table"
                                      cellpadding="0" cellspacing="0">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <table
                                              style="width:100%;min-width:100%;border:0px none rgb(255,255,255);padding:0px;word-break:break-word;background-color:transparent;font-size:14px;font-family:Roboto,Arial,sans-serif"
                                              cellpadding="0" cellspacing="0">
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <div>`;
  let htmlBottom = `</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0"
                      style="padding:13px 10px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table">
                      <tbody>
                        <tr>
                          <td>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                              style="min-width:100%;max-width:100%;width:100%;min-height:1px">
                              <tbody>
                                <tr>
                                  <td
                                    style="height:1px;width:100%;min-width:100%;line-height:1px;font-size:1px;background-color:rgb(164,164,164)">
                                    <br>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style="padding:15px 20px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table"
                      cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <table
                              style="width:100%;min-width:100%;border:0px none rgb(255,255,255);padding:0px;word-break:break-word;background-color:transparent;font-size:14px;font-family:Roboto,Arial,sans-serif"
                              cellpadding="0" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td>
                                    <div>
                                      <span style="font-size:12px"><span
                                          style="font-family:Roboto,Arial,sans-serif;color:black !important">&copy; LandVesto. Toate drepturile
                                          rezervate.<br>
                                          <br>
                                          Acesta este un email generat automat. Te rugăm să nu răspunzi la acest
                                          email.</span></span><br><br>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div>
                                      <span style="font-size:12px"><span
                                          style="font-family:Roboto,Arial,sans-serif;color:#bdbdbd !important">Prezentul mesaj este confidențial și aparține TULOCO. Acesta se adresează doar persoanei menționate la destinatar, precum și altor persoane autorizate să-l primească. În cazul în care nu sunteți destinatarul vizat, vă aducem la cunoștință că dezvăluirea, copierea, distribuirea sau inițierea unor acțiuni pe baza prezentei informații sunt strict interzise și atrag răspunderea juridică. Dacă ați primit acest mesaj dintr-o eroare, vă rugăm să ne anunțați imediat, ca răspuns la mesajul de față, și să-l ștergeți apoi din sistemul dumneavoastră.<br><br>
                                          Document care conține date cu caracter personal protejate de prevederile Legii 190/2018, respectiv prevederile regulamentului (UE) 679/2016.</span></span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </td>
      </tr>
    </tbody>
  </table>
  </div>`;

  function getHtmlContact(options) {
    return `
    <br/><br/>
    <span style="line-height:1.5">
      <span style="font-size:16px">
        <div style="color:#000000 !important"><b>Nume:</b> ${options.name}</div><br/>
        <div style="color:#000000 !important"><b>Email:</b> ${options.email}</div><br/>
        <div style="color:#000000 !important"><b>Subiect:</b> ${options.subject}</div><br/>
        <div style="margin-bottom: 30px; color:#000000 !important"><b>Mesaj:</b> ${options.message}</div>
      </span>
    </span>
    `;
  }

  function getHtmlForgotPassword(access_token) {
    return `
    <br/>
    <span style="line-height:1.5">
      <span style="font-size:16px">
        <div style="margin-bottom: 30px; color:#000000 !important">This email was automatically generated by LandVesto.com</div>
        <br/>
        <div style="margin-bottom: 30px; color:#000000 !important">Access this link for reseting password:</div>
        <br/><br/>
        <div style="text-align: center;">
          <a href="http://localhost:5000/reset-password/${access_token}" style="position: relative; background: #ffffff; border-radius: 5px; color: #226e36; font-size: 16px;
          letter-spacing: 1px; padding: 15px 20px;min-width: 230px; border-top: 1px solid #CCCCCC;
          border-right: 1px solid #333333;
          border-bottom: 1px solid #333333;
          border-left: 1px solid #CCCCCC;">Reset password</a>
        </div>
      </span>
    </span>
    `;
  }

  function getHtmlValidateEmail(access_token) {
    return `
    <br/>
    <span style="line-height:1.5">
      <span style="font-size:16px">
        <div style="margin-bottom: 30px; color:#000000 !important">This email was automatically generated by LandVesto.com</div>
          <br/>
        <div style="margin-bottom: 30px; color:#000000 !important">Please use this link to verify the email address associated with your LandVesto.com account:</div>
        <br/><br/>
        <div style="text-align: center;">
          <a href="http://localhost:5000/validate-email/${access_token}" style="position: relative; background: #ffffff; border-radius: 5px; color: #226e36; font-size: 16px;
          letter-spacing: 1px; padding: 15px 20px;min-width: 230px; border-top: 1px solid #CCCCCC;
          border-right: 1px solid #333333;
          border-bottom: 1px solid #333333;
          border-left: 1px solid #CCCCCC;">Validate the email address</a>
        </div>
      </span>
    </span>
    `;
  }

  return {
    sendMailContact: (id_user, options) => new Promise((resolve, reject) => {
      let tmpHtml = getHtmlContact(options);

      const mailOptions = {
        subject: `Landvesto - Contact form`,
        email: options.email,
        content: htmlTop + tmpHtml + htmlBottom,
        date: new Date(),
        id_user_sender: id_user
      };

      db.models.EmailQueue.create(mailOptions).then(() => {
        resolve();
      }).catch(e => {
        reject(e);
      });
    }),

    sendMailResetPassword: (id_user, options) => new Promise((resolve, reject) => {
      let token = encodeURIComponent(options.access_token);
      let tmpHtml = getHtmlForgotPassword(token);

      const mailOptions = {
        subject: `Landvesto - Reset password`,
        email: options.email,
        content: htmlTop + tmpHtml + htmlBottom,
        date: new Date(),
        id_user_sender: id_user
      };

      db.models.EmailQueue.create(mailOptions).then(() => {
        resolve();
      }).catch(e => {
        reject(e);
      });
    }),

    sendMailValidateEmail: (id_user, options) => new Promise((resolve, reject) => {
      let token = encodeURIComponent(options.access_token);
      let tmpHtml = getHtmlValidateEmail(token);

      const mailOptions = {
        subject: `Landvesto - Validate the email address`,
        email: options.email,
        content: htmlTop + tmpHtml + htmlBottom,
        date: new Date(),
        id_user_sender: id_user
      };

      db.models.EmailQueue.create(mailOptions).then(() => {
        resolve();
      }).catch(e => {
        reject(e);
      });
    })
  };
};
