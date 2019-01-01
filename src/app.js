
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
const authController = require('./controllers/auth');

app.get('/signup', authController.signup);
app.get('/signin', authController.signin);
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/signup',
}));
app.get('/dashboard', isLoggedIn, authController.dashboard);
app.get('/logout', authController.logout);
app.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/dashboard',
  failureRedirect: '/signin',
}));

require('./../config/passport.js')(passport, models.user.getDatabaseModel());

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/signin');
}

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
