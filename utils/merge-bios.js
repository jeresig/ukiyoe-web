var mongoose = require("mongoose");
require("ukiyoe-models")(mongoose);

var Artist = mongoose.model("Artist");
var Bio = mongoose.model("Bio");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    Bio.mergeBios(process.argv[2], function() {
        console.log("DONE");
        process.exit(0);
    });
});
