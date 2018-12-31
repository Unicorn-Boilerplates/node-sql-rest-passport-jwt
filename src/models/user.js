const Sequelize = require('sequelize');
const User = {
	modelName: 'user',
	shape: {
	  firstName: {
	    type: Sequelize.STRING,
	  },
	  lastName: {
	    type: Sequelize.STRING,
	  }
	}
};
module.exports = User
