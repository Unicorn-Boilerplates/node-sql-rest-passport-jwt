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

// controllers

var user_controller = require('./controllers/user');


// list of model to import
const models = require('./models')


// TODO switch to development or production based on Env
const databaseManager = new DatabaseManager(configurationDatabase.development); 
const routeManager = new RouteManager();


// Setup all the models
for(var model in models){
	databaseManager.registerModel(models[model].modelName, models[model].shape)
}


//ar userdb = databaseManager.registerModel(user.modelName, user.shape)
//var projectdb = databaseManager.registerModel(project.modelName, project.shape)
databaseManager.registerRelationship(databaseManager.getModel('project'),databaseManager.getModel('user'),BELONGS_TO_MANY, {through: 'UserProject'}, false);
databaseManager.registerRelationship(databaseManager.getModel('user'),databaseManager.getModel('project'),BELONGS_TO_MANY, {through: 'UserProject'}, false);
databaseManager.listRelationships();
// Setup all the routes
routeManager.addRoute(app,'get','/test', function (req, res) {
  res.send('test')
})
routeManager.addRoute(app,'get','/test2', function (req, res) {
  res.send('test2')
})

console.log(user_controller)
routeManager.addRoute(app,'get','/users', user_controller.get_users)
routeManager.addRoute(app,'get','/user:id', user_controller.get_user)





// debug all the register models and routes
databaseManager.listModels()
routeManager.listRoutes()



// Setup the Http(s) server for the app.
http.createServer(app).listen(80);
https.createServer(app).listen(443);


module.exports = app;