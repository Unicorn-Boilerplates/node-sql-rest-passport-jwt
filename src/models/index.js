const {
  DatabaseManager,
  BELONGS_TO,
  HAS_MANY,
  BELONGS_TO_MANY,
} = require('./../utils/databaseManager');
const configurationDatabase = require('../../config/database');

const models = [];
const databaseManager = new DatabaseManager(configurationDatabase.development);


require('fs').readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const name = file.replace('.js', '');
    exports[name] = models[name] = require(`./${file}`);
  }
});


// Setup all the models
for (const modelKey in models) {
  const model = models[modelKey];
  databaseManager.registerModel(models[modelKey]);
}

// ar userdb = databaseManager.registerModel(user.modelName, user.shape)
// var projectdb = databaseManager.registerModel(project.modelName, project.shape)
databaseManager.registerRelationship(models.project, models.user, BELONGS_TO_MANY, { through: 'UserProject' }, false);
databaseManager.registerRelationship(models.user, models.project, BELONGS_TO_MANY, { through: 'UserProject' }, false);


databaseManager.listModels();
databaseManager.listRelationships();
