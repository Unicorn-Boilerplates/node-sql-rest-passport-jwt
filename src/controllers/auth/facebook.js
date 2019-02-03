const passport = require('passport');
const userModel = require('./../../models/user');
const authenticationUtils = require('./../../utils/authenticationManager');

const facebookSignUp = passport.authenticate('facebook');
const facebookCallback = passport.authenticate('facebook', { failureRedirect: '/login' });

const redirectAfterSignup = function (req, res) {
  // Sign up complete with success.
  // Return a JWT Token
  const token = authenticationUtils.createToken(req.user);
  res.send({
    token,
  });
};
module.exports = {
  facebookSignUp,
  facebookCallback,
  redirectAfterSignup,
};
