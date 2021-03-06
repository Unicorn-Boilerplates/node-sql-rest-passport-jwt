const passport = require('passport');
const userModel = require('./../../models/user');
const authenticationUtils = require('./../../utils/authenticationManager');

const instagramSignUp = passport.authenticate('instagram');
const instagramCallback = passport.authenticate('instagram', { failureRedirect: '/login' });

const redirectAfterSignup = function (req, res) {
  // Sign up complete with success.
  // Return a JWT Token
  const token = authenticationUtils.createToken(req.user);
  res.send({
    token,
  });
};
module.exports = {
  instagramSignUp,
  instagramCallback,
  redirectAfterSignup,
};
