var _ = require("lodash");
var async = require("async");
var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var ExtractedImage = mongoose.model("ExtractedImage");
var Image = mongoose.model("Image");

var batchSize = 1000;
var toCopy = ["_id", "source", "imageName", "url", "title", "description"];

/* Also add in update process
 * (potentially update all images, check dates first?)
 * - Update unmatched artist names.
 * - Update date created based upon artist dates
 * - Bring in latest image matches into related
 */

var processImages = function(extractedImages, callback) {
    async.eachLimit(extractedImages, 10, function(extracted, callback) {
        var imageProps = {
            modified: Date.now(),
            extractedImage: extracted._id,
            artistNames: extracted.artists.map(function(name) {
                return _.omit(name, "_id");
            }),
            // TODO: Correct the date from the artist's details
            dateCreated: _.omit(extracted.dateCreated, "_id")
            // related ?
        };

        // Copy over the remaining properties
        toCopy.forEach(function(prop) {
            imageProps[prop] = extracted[prop];
        });

        Image.create(imageProps, function(err, image) {
            extracted.modified = Date.now();
            extracted.image = image._id;
            extracted.save(callback);
        });
    });
};

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    var pos = 0;

    var query = {"image": {$eq: null}};

    ExtractedImage.count(query, function(err, count) {
        async.whilst(
            function() {
                return pos < count;
            },

            function(callback) {
                process.stdout.write("Getting " + pos + " to " +
                    (pos + batchSize) + "\r");
                ExtractedImage.find(query)
                    .limit(batchSize).skip(pos)
                    .exec(function(err, images) {
                        pos += batchSize;
                        processImages(images, callback);
                    });
            },

            function(err) {
                process.stdout.write("\nProcessing...\n");
                done();
            }
        );
    });
});