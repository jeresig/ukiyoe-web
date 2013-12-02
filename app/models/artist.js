var mongoose = require("mongoose"),
    mongoosastic = require("mongoosastic"),
    _ = require("lodash"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Name = require("./name"),
    YearRange = require("./yearrange"),
    Bio = require("./bio"),
    romajiName = require("romaji-name");

var ArtistSchema = new Schema({
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

    // Eras in which the artist was active
    eras: [{type: ObjectId, ref: "Era"}],

    */

    // Locations in which the artist was active
    locations: [String],

    active: YearRange,
    activeAlt: [YearRange],
    life: YearRange,
    lifeAlt: [YearRange],

    gender: {type: String, es_indexed: true}
});

ArtistSchema.methods = {
    mergeName: function(bio) {
        var artist = this;
        var current = artist.name;
        var other = bio.name;

        if (!current.locale || current.locale == other.locale) {
            // Handle ja locale differently
            if (other.locale === "ja") {
                if (!current.given) {
                    if (!current.given_kanji && !other.given_kanji ||
                            current.given_kanji === other.given_kanji &&
                            current.generation === other.generation ||
                            !current.given_kanji && !current.given) {
                        if (!current.given_kanji && !current.given &&
                                !current.generation && other.generation) {
                            current.generation = other.generation;
                        }
                        if (other.given) {
                            current.given = other.given;
                        }
                        if (other.given_kana) {
                            current.given_kana = other.given_kana;
                        }
                    }
                }

                if (!current.surname) {
                    if (current.given === other.given &&
                        current.generation === other.generation &&
                        (current.surname_kanji === other.surname_kanji ||
                        !current.surname_kanji)) {
                        if (other.surname) {
                            current.surname = other.surname;
                        }
                        if (other.surname_kana) {
                            current.surname_kana = other.surname_kana;
                        }
                    }
                }

                if (!current.given_kanji) {
                    if (!current.given && !other.given ||
                            current.given === other.given &&
                            current.generation === other.generation ||
                            !current.given_kanji && !current.given) {
                        if (other.given_kanji) {
                            current.given_kanji = other.given_kanji;
                        }
                        if (other.generation) {
                            current.generation = other.generation;
                        }
                    }
                }

                if (!current.surname_kanji) {
                    if (current.given_kanji === other.given_kanji &&
                        current.generation === other.generation) {
                        if (other.surname_kanji) {
                            current.surname_kanji = other.surname_kanji;
                        }
                    }
                }
            } else {
                if (!current.given && !current.surname) {
                    if (other.given) {
                        current.given = other.given;
                    }
                    if (other.surname) {
                        current.surname = other.surname;
                    }
                    if (other.generation) {
                        current.generation = other.generation;
                    }
                }
            }
        }

        if (current.locale === undefined) {
            if (other.locale !== undefined) {
                current.locale = other.locale;
            }
        }

        if (artist._isAliasDuplicate(other)) {
            var alias = _.clone(other);
            alias.source = bio;
            artist.aliases.push(alias);
        }

        // Merge the aliases
        if (bio.aliases && bio.aliases.length > 0) {
            // Push the aliases on and add bio source
            bio.aliases.forEach(function(alias) {
                alias = _.clone(alias);
                alias.source = bio;
                artist.aliases.push(alias);
            });

            // Try to merge in missing details from aliases
            if (!current.given_kanji || !current.surname_kanji || !current.surname) {
                artist.aliases.forEach(function(alias) {
                    artist.mergeName({name: alias});
                });
            }
        }

        // Re-gen kanji, name, plain, ascii
        romajiName.injectFullName(current);

        // Remove any duplicate aliases
        artist.aliases = _.uniq(artist.aliases.filter(function(alias) {
            return artist._isAliasDuplicate(alias);
        }), false, function(alias) {
            return alias.plain;
        });
    },

    _isAliasDuplicate: function(alias) {
        var artist = this;
        return artist.name.given !== alias.given ||
            artist.name.surname !== alias.surname ||
            artist.name.given_kanji !== alias.given_kanji ||
            artist.name.surname_kanji !== alias.surname_kanji ||
            artist.name.generation !== alias.generation;
    },

    mergeDates: function(bio, type) {
        var artist = this;

        if (!type) {
            artist.mergeDates(bio, "life");
            artist.mergeDates(bio, "active");
            return;
        }

        var current = artist[type];
        var other = bio[type];

        if (current && other) {
            if ((!current.start || current.start === other.start) && other.start &&
                    other.start) {
                current.start = other.start;
                current.start_ca = other.start_ca || current.start_ca;
            }
            if ((!current.end && !current.current || current.end === other.end) && other.end) {
                current.end = other.end;
                current.end_ca = other.end_ca || current.end_ca;
            }
            if (!current.end && other.current) {
                current.current = other.current;
            }

        } else if (!current && other) {
            current = artist[type] = _.clone(other);
        }

        // If there is a mis-match then we need to add it as an alt
        if (artist._isDateDuplicate(bio, type)) {
            // Push the date on and add bio source
            var altDate = _.clone(other);
            altDate.source = bio;
            artist[type + "Alt"].push(altDate);
        }
    },

    _isDateDuplicate: function(bio, type) {
        var current = this[type];
        var other = bio[type];
        return current && other && (current.start !== other.start ||
            current.end !== other.end || current.current !== other.current);
    },

    addBio: function(bio) {
        var artist = this;

        // Merge in artist name and aliases
        artist.mergeName(bio);

        // Merge in artist life and active dates
        artist.mergeDates(bio);

        // Merge locations
        if (bio.locations && bio.locations.length > 0) {
            artist.locations =
                _.uniq(artist.locations.concat(bio.locations), false);
        }

        // Merge in gender information
        if (!artist.gender) {
            artist.gender = bio.gender;
        }

        // Add bio to artist
        artist.bios.push(bio);

        // Add artist to bio
        bio.artist = artist._id;
    },

    mergeArtist: function(other) {
        var self = this;

        other.bios.forEach(function(bio) {
            self.addBio(bio);
        });
    },

    nameMatches: Bio.prototype.nameMatches,
    aliasMatches: Bio.prototype.aliasMatches,
    _checkDate: Bio.prototype._checkDate,
    dateMatches: Bio.prototype.dateMatches,
    matches: Bio.prototype.matches
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
            if (!err && results) {
                callback(err, results.hits.filter(function(artist) {
                    return artist.bios.every(function(otherBio) {
                        return bio.source !== otherBio.source;
                    });
                }));
            } else {
                callback(err);
            }
        });
    }
};

ArtistSchema.plugin(mongoosastic);

module.exports = mongoose.model("Artist", ArtistSchema);