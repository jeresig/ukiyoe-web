var mongoose = require("mongoose"),
    mongoosastic = require("mongoosastic"),
    env = process.env.NODE_ENV || "development",
    config = require("../../config/config")[env],
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

var ExtractedArtistSchema = new Schema({
    _id: ObjectId,

    // The date that this item was created
    created: {type: Date, "default": Date.now},

    // The date that this item was updated
    modified: Date,

    // The source of the artist information.
    source: {type: String, ref: "Source"},

    master: {type: String, ref: "Artist"},
    hasMaster: {type: Boolean, es_indexed: true, "default": false},

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

ExtractedArtistSchema.methods = {
    mergeBios: function(b) {
        var a = this;

        if (a.master && b.master) {
            if (a.master !== b.master) {
                // TODO: Should this be automated?
                a.master.mergeArtist(b.master);
                b.master = a.master;
                //masterArtists.splice(masterArtists.indexOf(a.master), 1);
            }
        } else if (a.master) {
            a.master.addBio(b);
        } else if (b.master) {
            b.master.addBio(a);
        } else if (a._id !== b._id) {
            var artist = ArtistSchema.createArtist();
            artist.addBio(a);
            artist.addBio(b);
        } else {
            console.log("Identical", (a.master === b.master))
        }
    },

    matches: function(b) {
        var a = this;

        if (a.name.plain === b.name.plain && a.dateMatches(b) !== false) {
            //console.log("name, date")
            return true;
        }

        if (a.name.generation && !a.name.surname && a.nameMatches(b)) {
            //console.log("no sur, given, a")
            return true;
        }

        if (b.name.generation && !b.name.surname && a.nameMatches(b)) {
            //console.log("no sur, given, b")
            return true;
        }

        /*
        if (a.aliases && a.aliases.some(function(artist) {
            return artistsMatch({name: b.name, life: b.life, active: b.active},
                {name: artist, life: a.life, active: a.active});
        })) {
            //console.log("aliases a")
            return true;
        }

        if (b.aliases && b.aliases.some(function(artist) {
            return artistsMatch({name: a.name, life: a.life, active: a.active},
                {name: artist, life: b.life, active: b.active});
        })) {
            //console.log("aliases b")
            return true;
        }
        */

        if (a.dateMatches(b)) {
            if (a.nameMatches(b) ||
                    a.name.given && a.name.given === b.name.given) {
                return true;
            }
        }

        return false;
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

ExtractedArtistSchema.statics = {
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
    }
};

ExtractedArtistSchema.plugin(mongoosastic);

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

    bios: [{type: ObjectId, ref: "ExtractedArtist"}],

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
    addBio: function(other) {
        var base = this;

        if (!base.name.given) {
            if (other.name.given) {
                base.name.given = other.name.given;
            }
            if (other.name.given_kana) {
                base.name.given_kana = other.name.given_kana;
            }
            if (other.name.given_kanji) {
                base.name.given_kanji = other.name.given_kanji;
            }
        }

        if (!base.name.surname && other.name.surname ||
            !base.name.surname_kanji && other.name.surname_kanji) {
                if (base.name.given || base.name.given_kanji) {
                    base.aliases.push(base.name);
                }
                base.name = _.clone(other.name);
        }

        // TODO: If the given names are equal copy over the kanji if it exists

        // TODO: Check if there is no surname

        // TODO: We may have found each other based upon kanji
        if (!base.name.kanji && other.name.kanji) {
            base.name.kanji = other.name.kanji;
            base.name.given_kanji = other.name.given_kanji;
            if (other.name.surname_kanji) {
                base.name.surname_kanji = other.name.surname_kanji;
            }
        }

        // Merge on the aliases
        if (other.aliases && other.aliases.length > 0) {
            base.aliases = base.aliases.concat(other.aliases);
        }

        // TODO: Merge locations

        // TODO: Find way of merging in kanji from aliases
        if (!base.name.kanij) {
            base.aliases.forEach(function(name) {

            });
        }

        //
        if (base.life && other.life) {
            if (!base.life.start && other.life.start) {
                base.life.start = other.life.start;
                base.life.start_ca = other.life.start_ca;
            }
            if (!base.life.end && other.life.end) {
                base.life.end = other.life.end;
                base.life.end_ca = other.life.end_ca;
            }

        } else if (!base.life && other.life) {
            base.life = other.life;
        }

        if (base.active && other.active) {
            if (!base.active.start && other.active.start) {
                base.active.start = other.active.start;
                base.active.start_ca = other.active.start_ca;
            }
            if (!base.active.end && other.active.end) {
                base.active.end = other.active.end;
                base.active.end_ca = other.active.end_ca;
            }

        } else if (!base.active && other.active) {
            base.active = other.active;
        }

        if (other.bios) {
            base.bios = base.bios.concat(other.bios);
        } else {
            base.bios.push(other);
        }

        other.master = base;
    },

    nameMatches: ExtractedArtistSchema.methods.nameMatches,
    dateMatches: ExtractedArtistSchema.methods.dateMatches,
    matches: ExtractedArtistSchema.methods.matches,

    mergeArtist: function(other) {
        var self = this;

        other.bios.forEach(function(bio) {
            self.addBio(bio);
        });
    }
};

var unknown = /Unidentified|Unknown|Unsigned|Unread|Anonymous/i;

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
    
    mergeArtists: function(callback) {
        // TODO: Need to populate bios
        ExtractedArtistSchema.find(function(err, artists) {
            var mergeNames = {};
            var count = 0;
            var jaArtists = [];
            var otherArtists = {};
            var allMatches = [];
            var noMatches = [];
            var deadMatches = [];
            var masterArtists = [];

            console.log("Processing...")

            artists.forEach(function(artist) {
                artist.matches = [];

                if (artist.name.locale === "ja") {
                    var given = artist.name.given;
                    var surname = artist.name.surname;
                    var given_kanji = artist.name.given_kanji;

                    if (!given) {
                        console.log(artist)
                    }

                    if (!(given in jaArtists)) {
                        jaArtists[given] = [];
                    }

                    jaArtists[given].push(artist);

                    artist.aliases.forEach(function(name) {
                        if (name.given) {
                            if (!(name.given in jaArtists)) {
                                jaArtists[name.given] = [];
                            }

                            jaArtists[name.given].push(artist);
                        }

                        if (name.given_kanji) {
                            if (!(name.given_kanji in jaArtists)) {
                                jaArtists[name.given_kanji] = [];
                            }

                            jaArtists[name.given_kanji].push(artist);
                        }
                    });

                    if (given_kanji) {
                        if (!(given_kanji in jaArtists)) {
                            jaArtists[given_kanji] = [];
                        }

                        jaArtists[given_kanji].push(artist);
                    }

                } else {
                    var name = artist.name.name;
                    var flippedName = romajiName.flipName(name);

                    if (flippedName in otherArtists) {
                        name = flippedName;
                    }

                    if (!(name in otherArtists)) {
                        otherArtists[name] = [];
                    }

                    otherArtists[name].push(artist);
                }
            });

            var total = 0;

            console.log("Processing Japanese Artists...");

            // TODO: Busted merging: 1a31cf9161c64e4cfdac8759cda0b059
            // TODO: Changing merging to go into a single mega artist entry
            // TODO: Get rid of excess words?
            // TODO: Get rid of Anonymous/Unidentified/Unsigned/etc.
            // Not Identified/
            // TODO: Attributed to/Artist in
            // TODO: Various Artists?
            // TODO: Remove prefixes (Sir)

            // Add ExtractedArtist into Artist
            // Merge Artist into Artist

            for (var given in jaArtists) {
                var matches = jaArtists[given];
                if (matches.length === 1) {
                    noMatches.push(matches);
                } else {
                    if (given === "Kunisada") {
                        console.log(given);
                    }
                    // TODO: Process entries here
                    for (var i = 0; i < matches.length - 1; i++) {
                        for (var j = i + 1; j < matches.length; j++) {
                            if (matches[i].matches(matches[j])) {
                                if (given === "Kunisada") {
                                    console.log("MATCH", matches[i].name.plain, matches[i]._id,
                                        matches[j].name.plain, matches[j]._id)
                                }
                                mergeArtists(matches[i], matches[j]);
                            }
                        }
                    }

                    if (given === "Kunihiro") {
                        //console.log(matches)
                    }
                }
            }

            console.log("Processing Other Artists...");

            for (var name in otherArtists) {
                var matches = otherArtists[name];
                if (matches.length === 1) {
                    deadMatches.push(matches[0]);
                } else {
                    console.log(name)
                    allMatches.push(matches);
                    total += matches.length;
                }
            }

            Object.keys(jaArtists).sort(function(a, b) {
                return jaArtists[b].length - jaArtists[a].length;
            }).slice(0, 50).forEach(function(given) {
                console.log(given + ": " + jaArtists[given].length);
                console.log(jaArtists[given].map(function(artist) {
                    return artist.name.name;
                }).join(", "))
            });

            //console.log(deadMatches.map(function(artist) {
                //return artist.name.name;
            //}).sort().join("\n"))

            console.log(artists.length);
            console.log("MATCHED: " + total);
            console.log("NO MATCHES: " + noMatches.length);
            console.log("DEAD: " + deadMatches.length);

            // TODO:
            // - Utagawa Toyoshige II inserted twice
            // - Kunisada II/III gobble up a lot of entries
            // - Find all entries that gobble up more than a couple bios

            artists.forEach(function(artist) {
                if (artist.master && masterArtists.indexOf(artist.master) < 0) {
                    // Disconcerting that this has happened...
                    masterArtists.push(artist.master);
                    //console.log(artist.name.plain)
                }
            })

            async.eachLimit(masterArtists, 5, function(artist, callback) {
                artist.aliases = _.uniq(artist.aliases.filter(function(alias) {
                    return alias.plain && alias.plain !== artist.name.plain;
                }), false, function(alias) {
                    return alias.plain;
                });

                artist.save(callback);
            }, callback);

            //console.log(Object.keys(mergeNames).sort());
            //console.log(Object.keys(mergeNames).length + "/" + count);
        });
    },

    createArtist: function() {
        var artist = new ArtistSchema();
        masterArtists.push(artist);
        return artist;
    }
};

ArtistSchema.plugin(mongoosastic);

mongoose.model("ExtractedArtist", ExtractedArtistSchema);
mongoose.model("Artist", ArtistSchema);

module.exports = {
    ExtractedArtist: ExtractedArtistSchema,
    Artist: ArtistSchema
};