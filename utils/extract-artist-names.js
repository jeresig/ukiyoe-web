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
var swapCheck = {};
var names = {};

var nameOptions = {
    stripParens: true
};

var lookupName = function(name, options) {
    if (name in nameCache) {
        return nameCache[name];
    }

    var results = romajiName.parseName(name, options);
    nameCache[name] = results;
    //console.log(results.name + "\t" + results.kanji + "\t" + results.original);

    if (results.name) {
        var ordered = results.surname + " " + results.given;
        var reversed = results.given + " " + results.surname;

        swapCheck[ordered] = true;

        if (reversed in swapCheck) {
            names[results.surname] = (names[results.surname] || 0) + 1;
            names[results.given] = (names[results.given] || 0) + 1;
            console.log("SWAPPED", results);
        }
    }

    if (results.locale === "" && !results.unknown) {
        console.log(results.name + "\t" + results.original);
    }

    return results;
};

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    romajiName.init(function() {
        files.forEach(function(file) {
            //console.log("Processing:", file);

            var datas = JSON.parse(fs.readFileSync(file, "utf8"));

            //nameCache = {};

            datas.forEach(function(data) {
                if (data.artist) {
                    if (/\bl\b/i.test(data.artist)) {
                        //console.log(data.artist)
                    }
                    lookupName(data.artist, nameOptions)
                }
            });
        });

        Object.keys(names).sort(function(a, b) {
            return names[a] - names[b];
        }).forEach(function(name) {
            console.log(name, names[name]);
        })

        console.log("DONE");
        process.exit(0);
    });
});