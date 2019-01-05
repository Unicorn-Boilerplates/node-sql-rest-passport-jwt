// Boilerplate DB interaction
const Sequelize = require('sequelize');

let db = null;
function registerDatabaseModel(model) {
  db = model;
}
function getDatabaseModel() {
  return db;
}


// Configuration
const name = 'user';
const schema = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  instagram_id: {
    type: Sequelize.STRING,
  },
  facebook_id: {
    type: Sequelize.STRING,
  },
  firstname: {
    type: Sequelize.STRING,
    //    notEmpty: true,
  },
  lastname: {
    type: Sequelize.STRING,
    //    notEmpty: true,
  },

  username: {
    type: Sequelize.TEXT,
  },

  about: {
    type: Sequelize.TEXT,
  },

  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: Sequelize.STRING,
    //    allowNull: false,
  },
  instagram_access_token: {
    type: Sequelize.STRING,
    //    allowNull: false,
  },
  facebook_access_token: {
    type: Sequelize.STRING,
    //    allowNull: false,
  },
  last_login: {
    type: Sequelize.DATE,
  },

  status: {
    type: Sequelize.ENUM('active', 'inactive'),
    defaultValue: 'active',
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
  getDatabaseModel,
  getUser,
  getAllUsers,
  getUserProject,
};
module.exports = User;
