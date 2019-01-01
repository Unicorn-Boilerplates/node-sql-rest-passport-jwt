const Sequelize = require('sequelize');
let db = null;
function registerDatabaseModel(model){
	db = model;
} 

const name = 'project';
const schema = {
	  projectName: {
	    type: Sequelize.STRING,
	  }
	};


const Project = {
	name,
	schema,
	registerDatabaseModel
}
module.exports = Project
