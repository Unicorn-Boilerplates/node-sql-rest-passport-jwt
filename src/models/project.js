const Sequelize = require('sequelize');
const Project = {
	modelName: 'project',
	shape: {
	  projectName: {
	    type: Sequelize.STRING,
	  }
	}
};
module.exports = Project
