// This file is for configuring passport signup / signin strategy
// load bcrypt
const bCrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const secrets = require('./../../../config/secret');
const authenticationUtils = require('./../../utils/authenticationManager');


module.exports = function(passport, user) {
  const User = user;
  const LocalStrategy = require('passport-local').Strategy;
  const InstagramStrategy = require('passport-instagram').Strategy;
  const FacebookStrategy = require('@passport-next/passport-facebook').Strategy;

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
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },

    ((req, email, password, done) => {
      const generateHash = function(password) {
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
            var returnUser = {
              id: newUser.id,
              token: authenticationUtils.createToken(newUser),
            }
            return done(null, returnUser);
          }
        });
      });
    }),


  ));

  // LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    ((req, email, password, done) => {
      console.log('Called signin');
      const User = user;
      const isValidPassword = function(userpass, password) {
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
      console.log(accessToken, profile);
      User.findOne({ where: { instagram_id: profile.id } }).then((user) => {
        if (user) {
          // Update access token
          user.update({
            instagram_access_token: accessToken,
          }).then((updatedUser) => {
            // const token = authenticationUtils.createToken(updatedUser.get());
            // console.log(token);
            done(null, updatedUser.get());
          });
        } else {
          const newUserdata = {
            instagram_id: profile.id,
            username: profile.username,
            instagram_access_token: accessToken,
          };


          User.create(newUserdata).then((newUser, created) => {
            if (!newUser) {
              return done(null, false, { message: 'Something went wrong with your Instagram auth' });
            }
            if (newUser) {
              return done(null, authenticationUtils.createToken(newUser));
            }
          });
        }
      });
    })));
  // Use the FacebookStrategy within Passport.
  // The Facebook authentication strategy authenticates users using a Facebook account and OAuth 2.0 tokens.
  // The app ID and secret obtained when creating an application are supplied as options when creating the strategy.
  // The strategy also requires a verify callback, which receives the access token and optional refresh token,
  // as well as profile which contains the authenticated user's Facebook profile. The verify callback must call
  // cb providing a user to complete authentication.
  passport.use(new FacebookStrategy({
      clientID: secrets.FACEBOOK_APP_ID,
      clientSecret: secrets.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost/auth/facebook/callback',
      graphApiVersion: 'v3.2',
      enableProof: true,
    },
    ((accessToken, refreshToken, profile, done) => {
      console.log(profile, accessToken, refreshToken);
      User.findOne({ where: { facebook_id: profile.id } }).then((user) => {
        if (user) {
          console.log(user);
          // Update access token
          user.update({
            facebook_access_token: accessToken,
          }).then(updatedUser => done(null, updatedUser.get()));
        } else {
          const newUserdata = {
            facebook_id: profile.id,
            facebook_access_token: accessToken,
            username: profile.displayName,
          };


          User.create(newUserdata).then((newUser, created) => {
            if (!newUser) {
              return done(null, false, { message: 'Something went wrong with your Instagram auth' });
            }
            if (newUser) {
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
