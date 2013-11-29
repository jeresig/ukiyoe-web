var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = {
    original: String,
    name: {type: String, es_indexed: true},
    ascii: String,
    plain: String,
    given: {type: String, es_indexed: true, es_boost: 2.0},
    given_kana: String,
    given_kanji: {type: String, es_indexed: true, es_boost: 2.0},
    surname: String,
    surname_kana: String,
    surname_kanji: String,
    kana: String,
    kanji: {type: String, es_indexed: true},
    locale: String,
    generation: Number,
    source: {type: ObjectId, ref: "Bio"}
};