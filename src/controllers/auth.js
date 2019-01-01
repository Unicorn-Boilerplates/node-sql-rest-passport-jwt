exports.signup = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ status: 'signup' }));
};

exports.signin = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ status: 'signin' }));
};

exports.dashboard = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ status: 'dashboard' }));
};

exports.logout = function (req, res) {
  req.session.destroy((err) => {
    res.redirect('/signup');
  });
};
