///////////////////
// VERSION 0.2 ///
/////////////////

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'NGI Shiny' });
  res.redirect('/forside');
});


module.exports = router;
