const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
const RouteManager = require('./utils/routeManager')
const routeManager = new RouteManager();

http.createServer(app).listen(80);
https.createServer(app).listen(443);

routeManager.addRoute(app,'get','/test', function (req, res) {
  res.send('test')
})


routeManager.addRoute(app,'get','/test2', function (req, res) {
  res.send('test2')
})

routeManager.listRoutes()


module.exports = app;