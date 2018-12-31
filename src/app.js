const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
const models = require('./models')

const RouteManager = require('./utils/routeManager')

// controllers

var user_controller = require('./controllers/user');


 
// TODO switch to development or production based on Env
const routeManager = new RouteManager();


 
// Setup all the routes
routeManager.addRoute(app,'get','/users', user_controller.get_users)
routeManager.addRoute(app,'get','/user:id', user_controller.get_user)



// debug all the register models and routes
routeManager.listRoutes()


// Setup error handling
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


// Setup the Http(s) server for the app.
http.createServer(app).listen(80);
https.createServer(app).listen(443);


module.exports = app;