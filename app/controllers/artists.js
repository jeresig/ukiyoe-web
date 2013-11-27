
/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
    Artist = mongoose.model("Artist"),
    utils = require("../../lib/utils"),
    _ = require("lodash");

/**
 * Load
 */

exports.load = function(req, res, next, id) {
    Artist.load(id, function(err, artist) {
        if (err) {
            return next(err);
        }
        if (!artist) {
            return next(new Error("not found"));
        }
        req.artist = artist;
        next();
    });
};

/**
 * Search
 */

exports.search = function(req, res) {
    var page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
    var perPage = 30;
    var options = {
        query: req.param("q") || "",
        size: perPage,
        from: page * perPage
    };

    Artist.search(options, {hydrate: true, hydrateOptions: {populate: "bios"}}, function(err, results){
        if (err) {
            return res.render("500");
        }

        res.render("artists/index", {
            title: "Artists",
            artists: results.hits,
            page: page + 1,
            pages: Math.ceil(results.total / perPage)
        });
    });
};

/**
 * List
 */

exports.index = function(req, res) {
    var page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
    var perPage = 30;
    var options = {
        query: "Hiroshige",
        size: perPage,
        from: page * perPage
    };

    Artist.search(options, {hydrate: true, hydrateOptions: {populate: "bios"}}, function(err, results){
        if (err) {
            return res.render("500");
        }

        res.render("artists/index", {
            title: "Artists",
            artists: results.hits,
            page: page + 1,
            pages: Math.ceil(results.total / perPage)
        });
    });
};

/**
 * New artist
 */

exports.new = function(req, res) {
    res.render("artists/new", {
        title: "New Artst",
        artist: new Artist({})
    });
};

/**
 * Create an artist
 */

exports.create = function(req, res) {
    var artist = new Artist(req.body);
    artist.user = req.user;

    artist.save(function(err) {
        if (!err) {
            req.flash("success", "Successfully created artist!");
            return res.redirect("/artists/" + artist._id);
        }

        res.render("artists/new", {
            title: "New Artist",
            artist: artist,
            errors: utils.errors(err.errors || err)
        });
    });
};

/**
 * Edit an artist
 */

exports.edit = function(req, res) {
    res.render("artists/edit", {
        title: "Edit " + req.artist.title,
        artist: req.artist
    });
};

/**
 * Update artist
 */

exports.update = function(req, res) {
    var artist = req.artist;
    artist = _.extend(artist, req.body);

    artist.save(function(err) {
        if (!err) {
            return res.redirect("/artists/" + artist._id);
        }

        res.render("artists/edit", {
            title: "Edit Artist",
            artist: artist,
            errors: err.errors
        });
    });
};

/**
 * Show
 */

exports.show = function(req, res) {
    res.render("artists/show", {
        title: req.artist.title,
        artist: req.artist
    });
};

/**
 * Delete an artist
 */

exports.destroy = function(req, res) {
    var artist = req.artist;
    artist.remove(function(err) {
        req.flash("info", "Deleted successfully")
        res.redirect("/artists")
    });
};
