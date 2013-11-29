var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    _id: String,
    name: String,
    name_kanji: String,
    description: String
});