const Sequelize = require('sequelize');

console.log('loaded user')
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
