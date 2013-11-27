var mongoose = require("mongoose"),
    schemas = require("../app/models/artist"),
    Bio = mongoose.model('Bio', schemas.Bio)
    Artist = mongoose.model('Artist', schemas.Artist);

mongoose.connect('mongodb://localhost/extract');

mongoose.connection.on('error', function(err) {
    console.error('Connection Error:', err)
});

mongoose.connection.once('open', function() {

    if (!true) {
        console.log(schemas.ExtractedArtist.tree)
        var gen = require("../node_modules/mongoosastic/lib/mapping-generator");
        var serialize = require("../node_modules/mongoosastic/lib/serialize");
        (new gen).generateMapping(schemas.ExtractedArtist, function(err, mapping) {
            console.log(JSON.stringify(mapping));
            ExtractedArtist.load("527bf99fc32a6267210000f6", function(err, model) {
                console.log(serialize(model, mapping));
            })
        });
        
        ExtractedArtist.search({query: "Yoshitoshi", size: 20}, function(err, results){
            console.log(JSON.stringify(results))
        })
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