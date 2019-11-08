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
  }
});


// proxy routes not set earlier
// router.all('/*', secured(), function (req, res, next) {
router.all('/*', function (req, res, next) {

  var cookieOptions = {
    maxAge: (1 * 60 * 60 * 1000) // 1 hour
  }

  // // set user meta in cookies
  // res.cookie('user_name', req.user.nickname, cookieOptions);
  // res.cookie('user_email', req.user.emails[0].value, cookieOptions);
  // res.cookie('user_domain', req.user.emails[0].value.split('@')[1]);

  proxy.web(req, res);

});


module.exports = router;
