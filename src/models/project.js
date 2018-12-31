const Sequelize = require('sequelize');
let db = null;


const name = 'project';
const schema = {
	  projectName: {
	    type: Sequelize.STRING,
	  }
	};

function registerDatabaseProxy(sequelize){
	console.log('Register db for model' + name);
	db = sequelize;
} 
const Project = {
	name,
	schema,
	registerDatabaseProxy
}
module.exports = Project
