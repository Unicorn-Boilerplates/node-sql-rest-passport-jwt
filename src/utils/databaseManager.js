const Sequelize = require('sequelize');

class DatabaseManager {
  constructor(settings){
  	this.models = []
  	this.relationships = []
  	this.sequelize = new Sequelize(settings.database, settings.username, settings.password, {
		  host: settings.host,
		  dialect: settings.dialect,
		  operatorsAliases: false,
		  port:settings.port,
		  pool: {
		    max: 5,
		    min: 0,
		    acquire: 30000,
		    idle: 10000
		  }
		});
  }

	registerModel(name,shape){
		var newModel = this.sequelize.define(name, shape)
		this.models[name] = newModel;
		return newModel;
	}
	listModels(){
		console.log("==== Model Name ====")
		for(const model in this.models){
			console.log('Model Name:', model)
		}
	}
	registerRelationship(model1, model2, relationship, options, dropTableAndCreate = false){
		this.relationships.push({model1: model1.name, model2: model2.name, relationship: relationship});
		model1[relationship](model2, options)
		model2.sync({force: dropTableAndCreate})
		model1.sync({force: dropTableAndCreate})
		this.sequelize.sync()
	}

	listRelationships(){
		console.log("==== Relationship ====")
		for(const relationship of this.relationships){
			console.log(relationship.model1, relationship.relationship, relationship.model2);
		}
	} 
	dropDatabase(){
		this.sequelize.drop()
	}
}

const BELONGS_TO = 'belongsTo';
const HAS_MANY = 'hasMany';
const BELONGS_TO_MANY = 'belongsToMany'
module.exports = {DatabaseManager, BELONGS_TO, HAS_MANY, BELONGS_TO_MANY};