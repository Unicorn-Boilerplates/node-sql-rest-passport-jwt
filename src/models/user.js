// Boilerplate DB interaction
const Sequelize = require('sequelize');

let db = null;
function registerDatabaseModel(model) {
  db = model;
}


// Configuration
const name = 'user';
const schema = {
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
};

// Access and Editors
function getUser(id) {
  return db.findOne({ where: { id } });
}
function getAllUsers() {
  return db.findAll();
}

function getUserProject(id) {
  return getUser(id).then(user => user.getProjects().then(projects => projects));
}


// Export
const User = {
  name,
  schema,
  registerDatabaseModel,
  getUser,
  getAllUsers,
  getUserProject,
};
module.exports = User;
