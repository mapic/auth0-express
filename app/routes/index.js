///////////////////
// VERSION 0.2 ///
/////////////////

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('rendering index');
    res.redirect('/forside');
  res.render('index', { title: 'NGI Shiny' });
});


module.exports = router;
