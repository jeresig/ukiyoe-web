var mongoose = require("mongoose"),
    mongoosastic = require("mongoosastic"),
    async = require("async"),
    _ = require("lodash"),
    Name = require("./name"),
    YearRange = require("./yearrange");

var BioSchema = new mongoose.Schema({
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

        // Start by comparing the names in the two bios
        // falling back to checking the aliases if no name match happens
        var total = a.nameMatches(b) || a.aliasMatches(b);

        if (total > 0) {
            // The date works as a modifier
            total += a.dateMatches(b) - 1;
        }

        return Math.min(2, total);
    },

    aliasMatches: function(b) {
        var a = this;
        var best = 0;

        if (a.aliases) {
            a.aliases.forEach(function(alias) {
                best = Math.max(best, b.nameMatches({name: alias}));
            });
        }

        if (b.aliases) {
            b.aliases.forEach(function(alias) {
                best = Math.max(best, a.nameMatches({name: alias}));
            });
        }

        return best;
    },

    nameMatches: function(b) {
        var a = this;

        if (a.name.locale !== b.name.locale) {
            // Locales do not match, certainly not a match
            return 0;
        }

        if (a.name.generation !== b.name.generation) {
            // The generations are different, certainly not a match
            return 0;
        }

        if (a.name.given && b.name.given) {
            if (a.name.given === b.name.given) {
                if (a.name.surname === b.name.surname) {
                    // Full given, surname, generation match
                    return 2;
                } else if (!a.name.surname || !b.name.surname) {
                    // given, generation match, one surname is blank
                    return 1;
                } else if (a.name.locale === "ja") {
                    // surnames differ, but with Japanese name changes
                    // this happens more frequently, we want to detect this.
                    return 1;
                }
            }
            // TODO: Check swapped name :(
        }

        if (a.name.given_kanji && b.name.given_kanji) {
            if (a.name.given_kanji === b.name.given_kanji) {
                if (a.name.surname_kanji === b.name.surname_kanji) {
                    // Full given, surname, generation match
                    return 2;
                } else {
                    // surnames differ, but with Japanese name changes
                    // this happens more frequently, we want to detect this.
                    return 1;
                }
            }
        }

        // Nothing matches!
        return 0;
    },

    _checkDate: function(a, b) {
        if (a.start && b.start && a.end && b.end) {
            if (a.start === b.start && a.end === b.end) {
                // Start and end dates exist and match
                return 2;
            } else if (a.start === b.start || a.end === b.end) {
                // One of start or end dates match
                return 1;
            }
        } else if (a.start && b.start) {
            if (!a.end && !b.end && a.current === b.current) {
                // The person might still be alive
                return 2;
            } else if (a.start === b.start) {
                // Start dates match (but one is blank)
                return 1;
            }
        } else if (a.end && b.end) {
            if (a.end === b.end || a.current || b.current) {
                // End dates match (but one is blank)
                // or artist might still be alive
                return 1;
            }
        }

        // Nothing matches
        return 0;
    },

    dateMatches: function(b) {
        var a = this;
        var total = 0;

        if (a.life && b.life) {
            total += this._checkDate(a.life, b.life);
        }

        if (a.active && b.active) {
            total += this._checkDate(a.active, b.active);
        }

        // Make it so that if one date matches in life and
        // one date matches in active then it's a strong match.
        return Math.min(total, 2);
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

            async.eachLimit(bios, 1, function(bio, callback) {
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

                        artist.save(function(err) {
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