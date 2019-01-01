
const express = require('express');
const https = require('https');
const http = require('http');
const models = require('./models');

const app = express();

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
