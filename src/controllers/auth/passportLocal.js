const passport = require('passport');

const localSignUp = function(req, res, next) { passport.authenticate('local-signup',function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            console.log(info);
            // *** Display message without using flash option
            // re-render the login form with a message
            return res.redirect('/login');
        }
        console.log('got user', user);
        return res.json(user);
    })(req, res, next);
};

const localSignIn = passport.authenticate('local-signin', {
  successRedirect: '/dashboard',
  failureRedirect: '/signin',
});
module.exports = {
  localSignUp,
  localSignIn,
};
