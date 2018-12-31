const Sequelize = require('sequelize');
let db = null;
const name = 'user';
const schema = {
	firstName: {
    type: Sequelize.STRING,
	},
  lastName: {
	  type: Sequelize.STRING,
	}
};

function registerDatabaseProxy(sequelize){
	console.log('Register db for model' + name);
	db = sequelize;
} 

const User = {
	name,
	schema,
	registerDatabaseProxy
}
module.exports = User
