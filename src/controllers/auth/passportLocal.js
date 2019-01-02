const passport = require('passport');

const localSignUp = passport.authenticate('local-signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/signup',
});

const localSignIn = passport.authenticate('local-signin', {
  successRedirect: '/dashboard',
  failureRedirect: '/signin',
});
module.exports = {
  localSignUp,
  localSignIn,
};
