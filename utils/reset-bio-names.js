var mongoose = require("mongoose"),
    request = require("request"),
    Bio = require("../app/models/bio"),
    Artist = require("../app/models/artist"),
    romajiName = require("romaji-name"),
    async = require("async");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    romajiName.init(function() {
        console.log("Finding bios...");
        Bio.find({source: "bm"}, function(err, bios) {
            async.eachLimit(bios, 1, function(bio, callback) {
                var newName = romajiName.parseName(bio.name.original);

                if (newName.given !== bio.name.given ||
                        newName.surname !== bio.name.surname ||
                        newName.generation !== bio.name.generation) {
                    console.log("Updating: %s to %s", bio.name.name, newName.name);
                    bio.name = newName;
                    bio.save(callback);
                } else {
                    callback();
                }
            }, function() {
                console.log("DONE");
                process.exit(0);
            });
        });
    });
});