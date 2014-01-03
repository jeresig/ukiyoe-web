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
    return results;
};

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    async.eachLimit(files, 1, function(file, callback) {
        console.log("Processing:", file);

        var datas = JSON.parse(fs.readFileSync(file, "utf8"));

        nameCache = {};

        console.log("Removing old extracted images...");

        ExtractedImage.remove({source: datas[0].source}, function(err) {
            async.eachLimit(datas, 10, function(data, callback) {
                if (!data) {
                    return callback();
                }

                console.log("Saving:", data.source, data.source_id);

                var imageName = data.image_file.replace(/.jpg$/, "");

                ExtractedImage.create({
                    _id: data.source + "/" + imageName,
                    source: data.source,
                    modified: Date.now(),
                    extract: ["", data.source_id],
                    extracted: true,
                    imageURL: data.source_image,
                    imageName: imageName,
                    pageID: data.source_id,
                    url: data.source_url,
                    //lang: "en", // TODO: Fix this.
                    artists: data.artist ?
                        [lookupName(data.artist, nameOptions)] : [],
                    title: data.title,
                    description: data.description,
                    dateCreated: data.date ? yr.parse(data.date) : null
                }, function(err) {
                    if (err) {
                        // Ignore the error (could be a duplicate key error)
                        console.error(err);
                    }
                    callback();
                });
            }, callback);
        });
    }, function(err) {
        if (err) {
            console.error(err);
        }
        console.log("DONE");
        process.exit(0);
    });
});
