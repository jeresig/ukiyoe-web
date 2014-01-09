var async = require("async");
var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var ExtractedImage = mongoose.model("ExtractedImage");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    ExtractedImage.batchQuery({"image": null}, 1000, function(err, data) {
        if (data.done) {
            console.log("DONE");
            process.exit(0);
            return;
        }

        process.stdout.write("Processing " + data.from + " to " +
            data.to + "\r");
        async.eachLimit(data.images, 10, function(extracted, callback) {
            extracted.upgrade(callback);
        });
    });
});