var mongoose = require('mongoose');
var schemaUsers = new mongoose.Schema({
    NameUser: String,
    PasswordUser: String
});
module.exports = mongoose.model("Users", schemaUsers);