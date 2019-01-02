
const express = require('express');
const https = require('https');
const http = require('http');


// AUTH
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const models = require('./models');
// INIT

const app = express();
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const RouteManager = require('./utils/routeManager');

// controllers

const user_controller = require('./controllers/user');


// TODO switch to development or production based on Env
const routeManager = new RouteManager();


// Setup all the routes
routeManager.addRoute(app, 'get', '/users', user_controller.getUsers);
routeManager.addRoute(app, 'get', '/user/:id', user_controller.getUser);
routeManager.addRoute(app, 'get', '/user/:id/projects', user_controller.getUserProjects);


// debug all the register models and routes
routeManager.listRoutes();


// ROUTES for auth
const authController = require('./controllers/auth/auth');
const passportLocalController = require('./controllers/auth/passportLocal');

routeManager.addRoute(app, 'get', '/signup', authController.signup);
routeManager.addRoute(app, 'post', '/signup', passportLocalController.localSignUp);

routeManager.addRoute(app, 'get', '/signin', authController.signin);
routeManager.addRoute(app, 'post', '/signin', passportLocalController.localSignIn);
routeManager.addRoute(app, 'get', '/dashboard', authController.isLoggedIn, authController.dashboard);

routeManager.addRoute(app, 'get', '/logout', authController.logout);


require('./../config/passport.js')(passport, models.user.getDatabaseModel());


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
http.createServer(app).listen(80);
https.createServer(app).listen(443);


module.exports = app;
