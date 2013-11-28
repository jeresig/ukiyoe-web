var mongoose = require("mongoose"),
    mongoosastic = require("mongoosastic"),
    _ = require("lodash"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Name = require("./name"),
    YearRange = require("./yearrange"),
    Bio = require("./bio");

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

        bio.artist = artist._id;
    },

    nameMatches: Bio.prototype.nameMatches,
    aliasMatches: Bio.prototype.aliasMatches,
    dateMatches: Bio.prototype.dateMatches,
    matches: Bio.prototype.matches,

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

module.exports = mongoose.model("Artist", ArtistSchema);