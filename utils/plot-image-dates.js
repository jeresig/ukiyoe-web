var fs = require("fs");
var path = require("path");
var async = require("async");
var yr = require("yearrange");
var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var ExtractedImage = mongoose.model("ExtractedImage");

var dateMin = 1603;
var dateMax = 1940;
var maxSpan = 40;

var dates = {};
var outputFile = path.resolve(__dirname + "/../data/date-bins.csv");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    var query = {"dateCreated.start": {$ne: null}};

    for (var d = dateMin; d <= dateMax; d++) {
        dates[d] = 0;
    }

    ExtractedImage.find(query).stream()
        .on("data", function(image) {
            if (!image.dateCreated || !image.dateCreated.start ||
                !image.dateCreated.end ||
                image.dateCreated.end - image.dateCreated.start >= maxSpan) {
                return;
            }

            for (var d = image.dateCreated.start; d <= image.dateCreated.end; d++) {
                if (d >= dateMin && d <= dateMax) {
                    dates[d] += 1;
                }
            }
        })
        .on("error", function(err) {
            console.error(err);
        })
        .on("close", function() {
            var outStream = fs.createWriteStream(outputFile);

            outStream.write("Year\tCount\n");

            Object.keys(dates).forEach(function(key) {
                var data = [key, dates[key]].join("\t");
                outStream.write(data + "\n");
            });

            outStream.end();
            outStream.on("finish", function() {
                process.stdout.write("DONE\n");
                process.exit(0);
            });
        });
});