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

const VERIFY_EMAIL_MSG = 'Du har nå registrert en ny bruker som må verifiseres via en link tilsendt til din epostadresse. Ved spørsmål ta kontakt via <a href="mailto:miljoskytjenester@ngi.no">miljoskytjenester@ngi.no</a>.'
const UNAUTHORIZED_MSG = 'Du er ikke autorisert til å logge inn. Ved spørsmål ta kontakt via <a href="mailto:miljoskytjenester@ngi.no">miljoskytjenester@ngi.no</a>.'

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});

// ensure /logs/ sftp folder is not accessible
router.get('/logs', function (req, res, next) {
  res.redirect('/');
});


// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }

    // deny: not whitelisted
    if (req.query && req.query.error_description == 423) {
      res.status(423);
      return next(new Error(UNAUTHORIZED_MSG));
    }

    // deny: need to verify email
    if (req.query && req.query.error_description == 417) {
      res.status(417);
      return next(new Error(VERIFY_EMAIL_MSG));
    }

    if (!user) { 
      return res.redirect('/login'); 
    }

    // log in user
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/forside');
    });
  })(req, res, next);

});




// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {

  // log out user
  req.logout();

  // define urls
  var returnTo = 'https://' + req.hostname;
  var logoutURL = new url.URL(
    util.format('https://%s/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  // redirect to logout url
  res.redirect(logoutURL);
});

module.exports = router;
