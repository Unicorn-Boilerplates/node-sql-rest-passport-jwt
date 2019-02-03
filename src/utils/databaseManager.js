const Sequelize = require('sequelize');

class DatabaseManager {
  constructor(settings) {
    this.models = [];
    this.relationships = [];
    this.sequelize = new Sequelize(settings.database, settings.username, settings.password, {
      host: settings.host,
      dialect: settings.dialect,
      operatorsAliases: false,
      port: settings.port,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  registerModel(model) {
    const newModel = this.sequelize.define(model.name, model.schema);
    // inject DB
    console.log('di on db', model.name);
    model.registerDatabaseModel(newModel);
    this.models[model.name] = newModel;
    return newModel;
  }

  listModels() {
    console.log('==== Registered Models Name ====');
    for (const model in this.models) {
      console.log('Model Name:', this.models[model].name);
    }
  }

  registerRelationship(model1, model2, relationship, options, dropTableAndCreate = false) {
    console.log('register relationship ', relationship, model1.name, model2.name);
    console.log('===');
    this.relationships.push({ model1: model1.name, model2: model2.name, relationship });
    this.models[model1.name][relationship](this.models[model2.name], options);
    this.models[model2.name].sync({ force: dropTableAndCreate });
    this.models[model1.name].sync({ force: dropTableAndCreate });
    this.sequelize.sync();
  }

  listRelationships() {
    console.log('==== Rgistered Relationships ====');
    for (const relationship of this.relationships) {
      console.log(relationship.model1, relationship.relationship, relationship.model2);
    }
  }

  dropDatabase() {
    this.sequelize.drop();
  }

  sync() {
    this.sequelize.sync();
  }

  getModel(name) {
    return this.models[name];
  }
}

const BELONGS_TO = 'belongsTo';
const HAS_MANY = 'hasMany';
const BELONGS_TO_MANY = 'belongsToMany';
module.exports = {
  DatabaseManager, BELONGS_TO, HAS_MANY, BELONGS_TO_MANY,
};
