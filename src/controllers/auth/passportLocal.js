const passport = require('passport');

const localSignUp = function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      console.log(info);
      // *** Display message without using flash option
      // re-render the login form with a message
      // TODO FIX RETURN IN THIS CASE : just need to return a semantic error (404?)
      return res.redirect('/login');
    }
    console.log('got user', user);
    return res.json(user);
  })(req, res, next);
};

const localSignIn = function(req, res, next) {
  passport.authenticate('local-signin', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      console.log(info);
      // *** Display message without using flash option
      // re-render the login form with a message
      // TODO FIX RETURN IN THIS CASE : just need to return a semantic error (404?)
      return res.redirect('/login');
    }
    console.log('got user', user);
    return res.json(user);
  })(req, res, next);
};
module.exports = {
  localSignUp,
  localSignIn,
};
