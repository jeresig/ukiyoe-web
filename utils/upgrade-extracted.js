var async = require("async");
var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var ExtractedImage = mongoose.model("ExtractedImage");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    var query = {"image": null};

    if (process.argv[2]) {
        query.source = process.argv[2];
    }

    var queue = async.queue(function(extracted, callback) {
        console.log(extracted._id);
        extracted.upgrade(callback);
    }, 10);

    queue.drain = function() {
        console.log("DONE");
        process.exit(0);
    };

    ExtractedImage.find(query).stream()
        .on("data", function(extracted) {
            queue.push(extracted);
        })
        .on("error", function(err) {
            console.error(err);
        });
});