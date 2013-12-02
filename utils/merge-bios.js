var mongoose = require("mongoose"),
    Artist = require("../app/models/artist"),
    Bio = require("../app/models/bio");

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