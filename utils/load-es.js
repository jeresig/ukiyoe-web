var mongoose = require("mongoose"),
    Bio = require("../app/models/bio"),
    Artist = require("../app/models/artist");

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {

    if (!true) {
        Bio.createMapping(function(err, mapping) {
            var stream = Bio.synchronize();
            var count = 0;
            stream.on('data', function(err, doc){
                count++;
                //console.log('indexed ' + count);
            });
            stream.on('close', function(){
                process.exit(0);
            });
            stream.on('error', function(err){
                console.log(err);
            });
        });
    } else if (!true) {
        Artist.createMapping(function(err, mapping) {
            var stream = Artist.synchronize();
            var count = 0;
            stream.on('data', function(err, doc){
                count++;
                //console.log('indexed ' + count);
            });
            stream.on('close', function(){
                process.exit(0);
            });
            stream.on('error', function(err){
                console.log(err);
            });
        });
    } else {
        Bio.update({artist: {$ne: null}}, {artist: null}, {multi: true}, function(err, num) {
            console.log("DONE: ", num);
            process.exit(0);
        });
    }
});