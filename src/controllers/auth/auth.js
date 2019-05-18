const userModel = require('./../../models/user');
const authenticationUtils = require('./../../utils/authenticationManager');


exports.signup = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ status: 'signup' }));
};

exports.signInToken = function(req, res, next) {
  console.log('processing with token')
  authenticationUtils.ensureAuthenticated(req, res, function(err) {
    if (err) {
      console.log('error', err)
    }
    userModel.getUser(req.user).then((user) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(user));
    });
  })

}

exports.signin = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ status: 'signin' }));
};

exports.dashboard = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ status: 'dashboard' }));
};

exports.logout = function(req, res) {
  req.session.destroy((err) => {
    res.redirect('/signup');
  });
};


exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/signin');
};
