///////////////////
// VERSION 0.2 ///
/////////////////

var express = require('express');
var router = express.Router();
var httpProxy = require('http-proxy');
var secured = require('../lib/middleware/secured');

var proxy = httpProxy.createProxyServer({
  target: {
    host: process.env.SHINY_HOST,
    port: process.env.SHINY_PORT
  },
  // ws: true
});

// // Listen for the `error` event on `proxy`.
// proxy.on('error', function (err, req, res) {
//   console.log('proxy error:', err);
// });

// proxy.on('open', function (proxySocket) {
//   console.log('proxy open!');
// });


// router.all(/.*/, function (req, res, next) {
router.all('/*', secured(), function (req, res, next) {
  console.log('proxying..................');
  console.log('req.user:', req.user);


  var cookieOptions = {
    maxAge: (1 * 60 * 60 * 1000)
  }

  res.cookie('user_name', req.user.nickname, cookieOptions);
  res.cookie('user_email', req.user.emails[0].value, cookieOptions);
  res.cookie('user_domain', req.user.emails[0].value.split('@')[1]);

  proxy.web(req, res);
});


module.exports = router;
