var async = require("async");
var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var Artist = mongoose.model("Artist");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    process.stdin.on("data", function(data) {
        var name = data.toString().trim();
        Artist.searchByName(name, function(err, results) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(results.match && results.match.name.name,
                results.matches.map(function(match) {
                    return match.text + " " + match.score;
                })
            );
        });
    });
});