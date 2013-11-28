var mongoose = require("mongoose"),
    mongoosastic = require("mongoosastic"),
    env = process.env.NODE_ENV || "development",
    config = require("../../config/config")[env],
    async = require("async"),
    _ = require("lodash"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Name = {
    original: String,
    name: {type: String, es_indexed: true},
    ascii: String,
    plain: String,
    given: {type: String, es_indexed: true, es_boost: 2.0},
    given_kana: String,
    given_kanji: {type: String, es_indexed: true, es_boost: 2.0},
    surname: String,
    surname_kana: String,
    surname_kanji: String,
    kana: String,
    kanji: {type: String, es_indexed: true},
    locale: String,
    generation: Number
};

var YearRange = {
    original: String,
    start: {type: Number, es_indexed: true},
    start_ca: Boolean,
    end: {type: Number, es_indexed: true},
    end_ca: Boolean,
    current: {type: Boolean, es_indexed: true}
};

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

var ArtistSchema = new Schema({
    _id: ObjectId,

    // The date that this item was created
    created: {type: Date, "default": Date.now},

    // The date that this item was updated
    modified: Date,

    // The name of the artist
    name: Name,

    aliases: [Name],

    // TODO: Index this or make it the _id
    slug: {type: String, es_indexed: true},

    // Need a list of slugs to redirect?

    bios: [{type: ObjectId, ref: "Bio"}],

    /*

    // An image that is representative of the artist"s work
    repImage: {type: String, ref: "Image"},

    // An image depicting the artist
    artistImage: {type: String, ref: "Image"},

    // Locations in which the artist was active
    locations: [{type: ObjectId, ref: "Location"}],

    // Eras in which the artist was active
    eras: [{type: ObjectId, ref: "Era"}],

    */

    active: YearRange,
    life: YearRange,

    gender: {type: String, es_indexed: true}
});

ArtistSchema.methods = {
    addBio: function(bio) {
        var artist = this;

        if (!artist.name.given) {
            if (bio.name.given) {
                artist.name.given = bio.name.given;
                artist.name.name = artist.name.given;
            }
            if (bio.name.given_kana) {
                artist.name.given_kana = bio.name.given_kana;
            }
        }

        if (!artist.name.given_kanji) {
            if (bio.name.given_kanji) {
                artist.name.given_kanji = bio.name.given_kanji;
            }
        }

        if (!artist.name.surname && bio.name.surname ||
            !artist.name.surname_kanji && bio.name.surname_kanji) {
                if (artist.name.given || artist.name.given_kanji) {
                    artist.aliases.push(artist.name);
                }
                artist.name = _.clone(bio.name);
        }

        // TODO: If the given names are equal copy over the kanji if it exists

        // TODO: Check if there is no surname

        // TODO: We may have found each other based upon kanji
        if (!artist.name.kanji && bio.name.kanji) {
            artist.name.kanji = bio.name.kanji;
            artist.name.given_kanji = bio.name.given_kanji;
            if (bio.name.surname_kanji) {
                artist.name.surname_kanji = bio.name.surname_kanji;
            }
        }

        // Merge on the aliases
        if (bio.aliases && bio.aliases.length > 0) {
            artist.aliases = artist.aliases.concat(bio.aliases);
        }

        // TODO: Merge locations

        // TODO: Find way of merging in kanji from aliases
        if (!artist.name.kanij) {
            artist.aliases.forEach(function(name) {

            });
        }

        //
        if (artist.life && bio.life) {
            if (!artist.life.start && bio.life.start) {
                artist.life.start = bio.life.start;
                artist.life.start_ca = bio.life.start_ca;
            }
            if (!artist.life.end && bio.life.end) {
                artist.life.end = bio.life.end;
                artist.life.end_ca = bio.life.end_ca;
            }

        } else if (!artist.life && bio.life) {
            artist.life = bio.life;
        }

        if (artist.active && bio.active) {
            if (!artist.active.start && bio.active.start) {
                artist.active.start = bio.active.start;
                artist.active.start_ca = bio.active.start_ca;
            }
            if (!artist.active.end && bio.active.end) {
                artist.active.end = bio.active.end;
                artist.active.end_ca = bio.active.end_ca;
            }

        } else if (!artist.active && bio.active) {
            artist.active = bio.active;
        }

        // If we're merging in another artist
        if (bio.bios) {
            artist.bios = artist.bios.concat(bio.bios);
        } else {
            artist.bios.push(bio);
        }

        artist.aliases = _.uniq(artist.aliases.filter(function(alias) {
            return alias.plain && alias.plain !== artist.name.plain;
        }), false, function(alias) {
            return alias.plain;
        });

        bio.artist = artist;
    },

    nameMatches: BioSchema.methods.nameMatches,
    aliasMatches: BioSchema.methods.aliasMatches,
    dateMatches: BioSchema.methods.dateMatches,
    matches: BioSchema.methods.matches,

    mergeArtist: function(other) {
        var self = this;

        other.bios.forEach(function(bio) {
            self.addBio(bio);
        });
    }
};

ArtistSchema.statics = {
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

    potentialArtists: function(bio, callback) {
        var query = [];

        query.push(bio.name.name);
        query.push(bio.name.kanji);

        bio.aliases.forEach(function(alias) {
            query.push(alias.name);
            query.push(alias.kanji);
        });

        if (bio.life) {
            query.push(bio.life.start);
            query.push(bio.life.end);
        }

        if (bio.active) {
            query.push(bio.active.start);
            query.push(bio.active.end);
        }

        query = query.filter(function(part) {
            return !!part;
        }).join(" ");

        this.search({query: query}, {hydrate: true, hydrateOptions: {populate: "bios"}}, function(err, results) {
            // Filter out all the artists that already have a bio from the
            // same source as this one, as that'll likely be problematic
            callback(err, results.hits.filter(function(artist) {
                return artist.bios.every(function(otherBio) {
                    return bio.source !== otherBio.source;
                });
            }));
        });
    }
};

ArtistSchema.plugin(mongoosastic);

module.exports = {
    Bio: mongoose.model("Bio", BioSchema),
    Artist: mongoose.model("Artist", ArtistSchema)
};