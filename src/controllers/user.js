const userModel = require('./../models/user');

const getUser = function (req, res) {
  userModel.getUser(req.params.id).then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
  });
};

// Display detail page for a specific Author.
const getUsers = function (req, res) {
  userModel.getAllUsers().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(users));
  });
};

const getUserProjects = function (req, res) {
  userModel.getUserProject(req.params.id).then((projects) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(projects));
  });
};


module.exports = {
  getUser,
  getUsers,
  getUserProjects,
};
