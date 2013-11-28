var mongoose = require("mongoose"),
    Bio = require("../app/models/bio");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {
    Bio.mergeBios("bm", function() {
        console.log("DONE");
        process.exit(0);
    });
});