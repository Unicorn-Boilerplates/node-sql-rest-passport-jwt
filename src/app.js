
const express = require('express');
const https = require('https');
const http = require('http');


// AUTH
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const passportConfiguration = require('./../config/passport.js');
const models = require('./models');
// INIT

const app = express();
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const RouteManager = require('./utils/routeManager');

// Controllers
// User Controller
const user_controller = require('./controllers/user');
// Auth Controller
const authController = require('./controllers/auth/auth');
const passportLocalController = require('./controllers/auth/passportLocal');
const passportInstagramController = require('./controllers/auth/instagram');


// TODO switch to development or production based on Env
const routeManager = new RouteManager();

// Routes Management
// Setup all the routes
routeManager.addRoute(app, 'get', '/users', user_controller.getUsers);
routeManager.addRoute(app, 'get', '/user/:id', user_controller.getUser);
routeManager.addRoute(app, 'get', '/user/:id/projects', user_controller.getUserProjects);
// Local auth routes
routeManager.addRoute(app, 'get', '/signup', authController.signup);
routeManager.addRoute(app, 'post', '/signup', passportLocalController.localSignUp);
routeManager.addRoute(app, 'get', '/signin', authController.signin);
routeManager.addRoute(app, 'post', '/signin', passportLocalController.localSignIn);
routeManager.addRoute(app, 'get', '/dashboard', authController.isLoggedIn, authController.dashboard);
routeManager.addRoute(app, 'get', '/logout', authController.logout);
// Instagram auth routes
// GET /auth/instagram
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Instagram authentication will involve
//   redirecting the user to instagram.com.  After authorization, Instagram
//   will redirect the user back to this application at /auth/instagram/callback

routeManager.addRoute(app, 'get', '/auth/instagram', passportInstagramController.instagramSignUp);

// GET /auth/instagram/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

routeManager.addRoute(app, 'get', '/auth/instagram/callback',
  passportInstagramController.instagramCallback,
  passportInstagramController.redirectAfterSignup);


// Facebook auth routes


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

// debug all the register models and routes
routeManager.listRoutes();


// Inject user model on passport
passportConfiguration(passport, models.user.getDatabaseModel());
app.use(require('serve-static')(`${__dirname}/../../public`));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));


// Auth setup


// Setup error handling
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Setup the Http(s) server for the app.
http.createServer(app).listen(process.env.HTTP_PORT);
https.createServer(app).listen(process.env.HTTPS_PORT);


module.exports = app;
