const express = require('express');
const https = require('https');
const http = require('http');
const app = express();

const RouteManager = require('./utils/routeManager')
const {
	DatabaseManager, 
	BELONGS_TO,
	HAS_MANY,
	BELONGS_TO_MANY
}  = require('./utils/databaseManager')
const configurationDatabase = require('../config/database')



// list of model to import
const {user,project} = require('./models')



// TODO switch to development or production based on Env
const databaseManager = new DatabaseManager(configurationDatabase.development); 
const routeManager = new RouteManager();




// Setup the Http(s) server for the app.
http.createServer(app).listen(80);
https.createServer(app).listen(443);


// Setup all the models
var userdb = databaseManager.registerModel(user.modelName, user.shape)
var projectdb = databaseManager.registerModel(project.modelName, project.shape)
databaseManager.dropDatabase()
databaseManager.registerRelationship(projectdb,userdb,HAS_MANY, null, true);
databaseManager.registerRelationship(projectdb,userdb,BELONGS_TO_MANY, {through: 'UserProject'}, false);
databaseManager.registerRelationship(userdb,projectdb,BELONGS_TO_MANY, {through: 'UserProject'}, false);
databaseManager.listRelationships();
// Setup all the routes
routeManager.addRoute(app,'get','/test', function (req, res) {
  res.send('test')
})
routeManager.addRoute(app,'get','/test2', function (req, res) {
  res.send('test2')
})




// debug all the register models and routes
databaseManager.listModels()
routeManager.listRoutes()


module.exports = app;