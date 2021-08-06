var mongoose = require('mongoose');
var schemaApples = new mongoose.Schema({
    NameApple: String,
    ImageApple: String,
    PricesApple: Number,
    NotesApple: String
});
module.exports = mongoose.model("Apples", schemaApples);