var mongoose = require("mongoose");
var request = require("request");

require("ukiyoe-models")(mongoose);

var Image = mongoose.model("Image");
var ExtractedImage = mongoose.model("ExtractedImage");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {

    console.log("Deleting images...");
    Image.find().remove(function(err) {
        console.log("Resetting extractedimages...");
        ExtractedImage.update({image: {$ne: null}}, {image: null}, {multi: true}, function(err, num) {
            console.log("Deleting ES Images store...");
            request.del("http://localhost:9200/images", function() {
                console.log("Re-building Image Mongo/ES mapping...");
                Image.createMapping(function(err, mapping) {
                    var stream = Image.synchronize();
                    var count = 0;
                    stream.on('data', function(err, doc){
                        count++;
                    });
                    stream.on('close', function(){
                        console.log("DONE");
                        process.exit(0);
                    });
                    stream.on('error', function(err){
                        console.log(err);
                    });
                });
            });
        });
    });
});
