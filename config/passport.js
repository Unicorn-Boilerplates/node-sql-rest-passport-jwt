// This file is for configuring passport signup / signin strategy
// load bcrypt
const bCrypt = require('bcrypt-nodejs');
const secrets = require('./secret');

module.exports = function (passport, user) {
  const User = user;
  const LocalStrategy = require('passport-local').Strategy;
  const InstagramStrategy = require('passport-instagram').Strategy;


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });


  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    console.log(id, done);
    User.findById(id).then((user) => {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  // Local Strategy: allows authentication with username and password
  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },

    ((req, email, password, done) => {
      const generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      User.findOne({ where: { email } }).then((user) => {
        if (user) {
          return done(null, false, { message: 'That email is already taken' });
        }


        const userPassword = generateHash(password);
        const data = {
          email,
          password: userPassword,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        };


        User.create(data).then((newUser, created) => {
          if (!newUser) {
            return done(null, false);
          }

          if (newUser) {
            return done(null, newUser);
          }
        });
      });
    }),


  ));

  // LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    ((req, email, password, done) => {
      console.log('Called signin');
      const User = user;
      const isValidPassword = function (userpass, password) {
        return bCrypt.compareSync(password, userpass);
      };

      User.findOne({ where: { email } }).then((user) => {
        if (!user) {
          return done(null, false, { message: 'Email does not exist' });
        }

        if (!isValidPassword(user.password, password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        const userinfo = user.get();

        return done(null, userinfo);
      }).catch((err) => {
        console.log('Error from :', err);

        return done(null, false, { message: 'Something went wrong with your Signin' });
      });
    }),
  ));


  // Use the InstagramStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Instagram
  //   profile), and invoke a callback with a user object.
  passport.use(new InstagramStrategy({
    clientID: secrets.INSTAGRAM_CLIENT_ID,
    clientSecret: secrets.INSTAGRAM_CLIENT_SECRET,
    callbackURL: 'http://localhost/auth/instagram/callback',
  },
  ((accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    console.log(accessToken, refreshToken, profile);
    User.findOne({ where: { instagram_id: profile.id } }).then((user) => {
      if (user) {
        // Update access token
        console.log('user exists');
        user.update({
          instagram_access_token: accessToken,
        }).then(updatedUser => done(null, updatedUser.get()));
      } else {
        const newUserdata = {
          instagram_id: profile.id,
          username: profile.username,
          instagram_access_token: accessToken,
        };


        User.create(newUserdata).then((newUser, created) => {
          if (!newUser) {
            console.log('couldnt create the new user');
            return done(null, false, { message: 'Something went wrong with your Instagram auth' });
          }

          if (newUser) {
            console.log('New USer');
            return done(null, newUser);
          }
        });
      }
    });
  })));
};
