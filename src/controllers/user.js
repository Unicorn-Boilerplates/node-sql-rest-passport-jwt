const userModel = require('./../models/user');

const get_user = function(req, res) {
	userModel.getUser(req.params.id).then(user => {
		res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
	})	 
};

// Display detail page for a specific Author.
const get_users = function(req, res) {
	userModel.getAllUsers().then(users => {
		res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(users));
	})	 
};

const get_user_projects = function(req, res) {
	userModel.getUserProject(req.params.id).then(projects => {
		res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(projects));
	})	 
};


module.exports = {
	get_user,
	get_users,
	get_user_projects
}