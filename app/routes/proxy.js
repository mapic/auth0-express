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


// router.all(/.*/, function (req, res, next) {
router.all('/*', secured(), function (req, res, next) {
  console.log('proxying..................');
  proxy.web(req, res);
});


module.exports = router;
