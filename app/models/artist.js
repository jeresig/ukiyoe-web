var mongoose = require("mongoose"),
    env = process.env.NODE_ENV || "development",
    config = require("../../config/config")[env],
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Name = {
    original: String,
    name: String,
    ascii: String,
    plain: String,
    given: String,
    given_kana: String,
    given_kanji: String,
    surname: String,
    surname_kana: String,
    surname_kanji: String,
    kana: String,
    kanji: String,
    locale: String,
    generation: Number
};

var YearRange = {
    original: String,
    start: Number,
    start_ca: Boolean,
    end: Number,
    end_ca: Boolean,
    current: Boolean
};

var ExtractedArtistSchema = new Schema({
    _id: ObjectId,

    // The date that this item was created
    created: {type: Date, "default": Date.now},

    // The date that this item was updated
    modified: Date,

    // The source of the artist information.
    source: {type: String, ref: "Source"},

    extract: [String],

    extracted: Boolean,

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
    slug: String,

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

    gender: String
});

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
    }
};

mongoose.model("ExtractedArtist", ExtractedArtistSchema);
mongoose.model("Artist", ArtistSchema);