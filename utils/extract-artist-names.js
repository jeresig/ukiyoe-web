var fs = require("fs");
var path = require("path");
var async = require("async");
var romajiName = require("romaji-name");
var yr = require("yearrange");
var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var ExtractedImage = mongoose.model("ExtractedImage");

var files = process.argv.slice(2);

var nameCache = {};

var nameOptions = {
    stripParens: true
};

var lookupName = function(name, options) {
    if (name in nameCache) {
        return nameCache[name];
    }

    var results = romajiName.parseName(name, options);
    nameCache[name] = results;
    console.log(results);
    return results;
};

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    files.forEach(function(file) {
        //console.log("Processing:", file);

        var datas = JSON.parse(fs.readFileSync(file, "utf8"));

        nameCache = {};

        datas.forEach(function(data) {
            if (data.artist) {
                //if (/various/i.test(data.artist)) {
                    //console.log(data.artist)
                //}
                lookupName(data.artist, nameOptions)
            }
        });
    });

    console.log("DONE");
    process.exit(0);
});