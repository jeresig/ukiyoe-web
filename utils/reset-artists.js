var path = require("path");
var mongoose = require("mongoose");
var request = require("request");

require("ukiyoe-models")(mongoose);

var Artist = mongoose.model("Artist");
var Bio = mongoose.model("Bio");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {

    console.log("Deleting artists...");
    Artist.find().remove(function(err) {
        console.log("Resetting bios...");
        Bio.update({artist: {$ne: null}}, {artist: null, possibleArtists: []}, {multi: true}, function(err, num) {
            console.log("Deleting ES Artists store...");
            request.del("http://localhost:9200/artists", function() {
                console.log("Re-building Artist Mongo/ES mapping...");
                Artist.createMapping(function(err, mapping) {
                    var stream = Artist.synchronize();
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
