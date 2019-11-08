///////////////////
// VERSION 0.2 ///
/////////////////
var querystring = require('querystring');
var passport = require('passport');
var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
var util = require('util');
var url = require('url');


dotenv.config();


// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  console.log('redirecting to /')
  res.redirect('/');
});



// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    console.log('callback, err, user, info:', err, user, info);
    if (err) { return next(err); }


    console.log('req.query: ', req.query);
    console.log('req.params: ', req.params);

    // not whitelisted
    if (req.query && req.query.error_description == 423) {
      res.status(403);
      return next(new Error('Du er ikke autorisert til å logge inn. Kontakt NGI for mer informasjon.'));

      // })
      // return res.render('error', {
      //   message: 'You are not authorized to create an account. Please contact NGI.',
      //   error: info
      // });      
    }


    if (!user) { 
      console.log('redirecting to ///login');
      return res.redirect('/login'); 
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      console.log('redirecting to: ', returnTo)
      res.redirect(returnTo || '/forside');
    });
  })(req, res, next);
});




// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  var returnTo = 'https://' + req.hostname;
  
  var logoutURL = new url.URL(
    util.format('https://%s/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  console.log('redirecting to /logout', logoutURL);

  res.redirect(logoutURL);
});




module.exports = router;


