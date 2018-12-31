const userModel = require('./../models/user');

const get_user = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
};

// Display detail page for a specific Author.
const get_users = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail:');
};


module.exports = {get_user:get_user, get_users:get_users}