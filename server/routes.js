module.exports = app => {
  'use strict';
  const express = require("express");
  const appPath = __dirname + '/../client';
  const path = require('path');
  const errors = require('./errors');
  const requireLogin = require('./authorization/authentication').requireLogin;

  /* LOGIN */
  app.use('/api', require('./authorization/jwtInit')(app));
  app.use('/api/refreshToken', requireLogin, require('./utils/refreshToken')(app));

  /* ADMIN */
  app.use('/api/admin/post', requireLogin, require('./routes/admin/post')(app));
  app.use('/api/admin/winner', requireLogin, require('./routes/admin/winner')(app));
  app.use('/api/admin/subscription', requireLogin, require('./routes/admin/subscription')(app));
  app.use('/api/admin/errors', requireLogin, require('./routes/admin/errors')(app));

  /* POST */
  app.use('/api/post', require('./routes/post/post')(app));

  /* WINNER */
  app.use('/api/winner', require('./routes/winner/winner')(app));

  /* USER GUESTS (that are not login yet)*/
  app.use('/api/clientGuests', require('./routes/user/clientGuests')(app));

  /* USER GUESTS (that ARE login)*/
  app.use('/api/client', requireLogin, require('./routes/user/client')(app));
  app.use('/api/client/subscription', requireLogin, require('./routes/user/subscription')(app));

  /* HOME */
  app.use('/api/home', require('./routes/home/home')(app));

  /* EMAIL */
  app.use('/api/emailSender', require('./routes/email/emailSender')(app));
  app.use('/api/emailQueue', require('./routes/email/emailQueue')(app));

  /* STRIPE WEBHOOK (no auth) */
  app.use('/api/stripe', require('./routes/stripe/stripe'));

  app.route('*/:url(api|auth|components|app|bower_components)/*').get(errors[404]);

  /* BUILD */

  // Serve static files from the browser folder
  app.use(express.static(path.join(appPath, 'dist/client/browser')));
  app.get('/*', (req, res) => res.sendFile(path.join(appPath, 'dist/client/browser', 'index.html')));

  app.route('*').get(errors[404]);
};
