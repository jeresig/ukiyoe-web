
/*!
 * Module dependencies.
 */
module.exports = function(ukiyoe) {

var ages = require("../../data/ages.json");
var highlighted = require("../../data/highlighted-artists.json");

var exports = {};

ages.forEach(function(age) {
    age.artists = [];

    for (var name in highlighted) {
        var artist = highlighted[name];

        if (artist.age === age.name) {
            var parts = artist.image.split("/");
            artist.thumb =
                "http://data.ukiyo-e.org/" + parts[0], "thumbs", parts[1] + ".jpg";
            //artist.artist = site.artistMap[name];
            age.artists.push(artist);
        }
    }

/*
    age.artists = age.artists.sort(function(a, b) {
        return b.artist.matches - a.artist.matches;
    });
*/
});

exports.index = function (req, res) {
    res.render("home/index", {
        title: req.i18n.__("Japanese Woodblock Print Search"),
        desc: req.i18n.__("Japanese Woodblock print search engine. Searches thousands of Ukiyo-e, Meiji, Shin Hanga, and Sosaku Hanga prints."),
        ages: ages,
        total: "200,000"
    });
};

exports.about = function (req, res) {
    res.render("home/about");
};

return exports;
};