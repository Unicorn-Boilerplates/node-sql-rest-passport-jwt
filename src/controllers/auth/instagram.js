const passport = require('passport');
const userModel = require('./../../models/user');

const instagramSignUp = passport.authenticate('instagram');
const instagramCallback = passport.authenticate('instagram', { failureRedirect: '/login' });
module.exports = {
  instagramSignUp,
  instagramCallback,
};
