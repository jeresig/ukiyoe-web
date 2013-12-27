var fs = require("fs");
var path = require("path");
var async = require("async");
var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var ExtractedImage = mongoose.model("ExtractedImage");

var dates = {};
var batchSize = 1000;
var outputFile = path.resolve(__dirname + "/../data/date-styles.csv");

var processImages = function(images) {
    images.forEach(function(image) {
        if (!image.dateCreated) {
            return;
        }

        var date = image.dateCreated;
        var key = date.replace(/[0-9]/g, "X");

        if (!dates[key]) {
            dates[key] = [];
        }

        dates[key].push(date);
    });
};

var done = function() {
    
    var sortedKeys = Object.keys(dates).sort(function(a, b) {
        return dates[b].length - dates[a].length;
    });

    var outStream = fs.createWriteStream(outputFile);

    sortedKeys.forEach(function(key) {
        var data = [key, dates[key].length, dates[key][0]].join("\t");
        outStream.write(data + "\n");
    });

    outStream.end();
    outStream.on("finish", function() {
        process.stdout.write("DONE\n");
        process.exit(0);
    });
};

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    var pos = 0;

    ExtractedImage.count(function(err, count) {
        async.whilst(
            function() {
                return pos < count;
            },

            function(callback) {
                process.stdout.write("Getting " + pos + " to " +
                    (pos + batchSize) + "\r");
                ExtractedImage.find().limit(batchSize).skip(pos)
                    .exec(function(err, images) {
                        processImages(images);
                        pos += batchSize;
                        callback(err);
                    });
            },
            
            function(err) {
                process.stdout.write("\nProcessing...\n");
                done();
            }
        );
    });
});
