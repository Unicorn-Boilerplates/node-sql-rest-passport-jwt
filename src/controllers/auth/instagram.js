const passport = require('passport');
const userModel = require('./../../models/user');

const instagramSignUp = passport.authenticate('instagram');
const instagramCallback = passport.authenticate('instagram', { failureRedirect: '/login' });

const redirectAfterSignup = function (req, res) {
  res.redirect('/dashboard');
};
module.exports = {
  instagramSignUp,
  instagramCallback,
  redirectAfterSignup,
