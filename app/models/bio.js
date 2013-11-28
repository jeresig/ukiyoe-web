var mongoose = require("mongoose"),
    mongoosastic = require("mongoosastic"),
    async = require("async"),
    _ = require("lodash"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Name = require("./name"),
    YearRange = require("./yearrange");

var BioSchema = new Schema({
    _id: ObjectId,

    // The date that this item was created
    created: {type: Date, "default": Date.now},

    // The date that this item was updated
    modified: Date,

    // The source of the artist information.
    source: {type: String, ref: "Source"},

    artist: {type: String, ref: "Artist"},
    possibleArtists: [{type: String, ref: "Artist"}],

    extract: [String],

    extracted: {type: Boolean, es_indexed: true},

    // UUID of the source page. (Format: PAGEMD5)
    pageID: String,

    // Full URL of the original page from where the image came.
    url: String,

    // The language of the page from where the data is being extracted.
    // This will influence how extracted text is handled.
    lang: String,

    // The name of the artist
    name: Name,

    aliases: [Name],

    bio: String,

    active: YearRange,
    life: YearRange,

    gender: String,

    // Locations in which the artist was active
    locations: [String]
});

BioSchema.methods = {
    matches: function(b) {
        var a = this;

        if (a.name.plain === b.name.plain && a.dateMatches(b) !== false) {
            return true;
        }

        if (a.name.generation && !a.name.surname && a.nameMatches(b)) {
            return true;
        }

        if (b.name.generation && !b.name.surname && a.nameMatches(b)) {
            return true;
        }

        if (a.dateMatches(b) && (a.nameMatches(b) ||
                a.name.given && a.name.given === b.name.given)) {
            return true;
        }

        return false;
    },

    aliasMatches: function(b) {
        var a = this;

        if (a.aliases && a.aliases.some(function(alias) {
            return b.matches({name: alias, life: a.life, active: a.active});
        })) {
            return true;
        }

        if (b.aliases && b.aliases.some(function(alias) {
            return a.matches({name: alias, life: b.life, active: b.active});
        })) {
            return true;
        }
    },

    nameMatches: function(b) {
        var a = this;
        return (a.name.given && a.name.given === b.name.given ||
                // These are just the worst. :(
                a.name.given && a.name.given === b.name.surname ||
                b.name.given && b.name.given === a.name.surname ||
                a.name.given_kanji && a.name.given_kanji === b.name.given_kanji) &&
            a.name.generation === b.name.generation;
    },

    dateMatches: function(b) {
        var a = this;

        if (a.life && b.life) {
            if (a.life.start && b.life.start) {
                return a.life.start === b.life.start;
            }
            if (a.life.end && b.life.end) {
                return a.life.end === b.life.end;
            }
        }

        if (a.active && b.active) {
            if (a.active.start && b.active.start) {
                return a.active.start === b.active.start;
            }
            if (a.active.end && b.active.end) {
                return a.active.end === b.active.end;
            }
        }
    }
};

BioSchema.statics = {
    /**
     * Find artist by id
     *
     * @param {ObjectId} id
     * @param {Function} callback
     * @api private
     */

    load: function(id, callback) {
        this.findOne({ _id : id }).exec(callback);
    },

    /**
     * List artists
     *
     * @param {Object} options
     * @param {Function} callback
     * @api private
     */

    list: function(options, callback) {
        var criteria = options.criteria || {};

        this.find(criteria)
            .sort({"createdAt": -1}) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(callback);
    },

    mergeBios: function(source, callback) {
        // TODO: Changing merging to go into a single mega artist entry
        // TODO: Get rid of excess words?
        // TODO: Get rid of Anonymous/Unidentified/Unsigned/etc.
        // Not Identified/
        // TODO: Attributed to/Artist in
        // TODO: Various Artists?
        // TODO: Remove prefixes (Sir)
        console.log("Loading %s bios...", source);

        var Artist = mongoose.model("Artist");

        // TODO: Need to populate bios
        this.find({source: source, artist: null}, function(err, bios) {
            var toSave = [];

            console.log("%s bios loaded.", bios.length);

            async.eachLimit(bios, 5, function(bio, callback) {
                // We don't want to handle bios that already have a master
                if (bio.artist) {
                    return callback();
                }

                Artist.potentialArtists(bio, function(err, artists) {
                    var strongMatches = [];
                    var weakMatches = [];

                    artists.forEach(function(artist) {
                        if (artist.matches(bio)) {
                            strongMatches.push(artist);
                        } else if (artist.nameMatches(bio) ||
                                artist.aliasMatches(bio)) {
                            weakMatches.push(artist);
                        }
                    });

                    var artist;

                    if (strongMatches.length > 0) {
                        if (strongMatches.length > 1) {
                            bio.possibleArtists = strongMatches;
                        } else {
                            artist = strongMatches[0];
                        }
                    } else if (weakMatches.length > 1) {
                        bio.possibleArtists = weakMatches;
                    } else {
                        artist = new Artist();
                    }

                    if (artist) {
                        console.log("Saving artist: %s",
                            artist.name && artist.name.name || "New Artist");

                        artist.addBio(bio);

                        artist.save(function() {
                            console.log("Saving bio %s to %s.", bio.name.name,
                                artist.name.name);

                            bio.save(callback);
                        });

                    } else {
                        console.log("Saving bio %s possibilities (%s).",
                            bio.name.name,
                            bio.possibleArtists.map(function(artist) {
                                return artist.name.name;
                            }).join(", ")
                        );

                        bio.save(callback);
                    }
                });
            }, function(err) {
                async.eachLimit(toSave, 5, function(artist, callback) {
                    console.log("Saving artist %s...", artist.name.name);
                    artist.save(callback);
                }, callback);
            });
        });
    }
};

BioSchema.plugin(mongoosastic);

module.exports = mongoose.model("Bio", BioSchema);