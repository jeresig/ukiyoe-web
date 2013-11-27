
/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
    ExtractedArtist = mongoose.model("ExtractedArtist"),
    utils = require("../../lib/utils"),
    _ = require("lodash");

/**
 * Load
 */

exports.load = function(req, res, next, id) {
    ExtractedArtist.load(id, function(err, extractedartist) {
        if (err) {
            return next(err);
        }
        if (!extractedartist) {
            return next(new Error("not found"));
        }
        req.extractedartist = extractedartist;
        next();
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

    ExtractedArtist.search(options, {hydrate: true}, function(err, results){
        if (err) {
            return res.render("500");
        }

        res.render("extractedartists/index", {
            title: "ExtractedArtists",
            extractedartists: results.hits,
            page: page + 1,
            pages: Math.ceil(results.total / perPage)
        });
    });
};

/**
 * New extractedartist
 */

exports.new = function(req, res) {
    res.render("extractedartists/new", {
        title: "New Artst",
        extractedartist: new ExtractedArtist({})
    });
};

/**
 * Create an extractedartist
 */

exports.create = function(req, res) {
    var extractedartist = new ExtractedArtist(req.body);
    extractedartist.user = req.user;

    extractedartist.save(function(err) {
        if (!err) {
            req.flash("success", "Successfully created extractedartist!");
            return res.redirect("/extractedartists/" + extractedartist._id);
        }

        res.render("extractedartists/new", {
            title: "New ExtractedArtist",
            extractedartist: extractedartist,
            errors: utils.errors(err.errors || err)
        });
    });
};

/**
 * Edit an extractedartist
 */

exports.edit = function(req, res) {
    res.render("extractedartists/edit", {
        title: "Edit " + req.extractedartist.title,
        extractedartist: req.extractedartist
    });
};

/**
 * Update extractedartist
 */

exports.update = function(req, res) {
    var extractedartist = req.extractedartist;
    extractedartist = _.extend(extractedartist, req.body);

    extractedartist.save(function(err) {
        if (!err) {
            return res.redirect("/extractedartists/" + extractedartist._id);
        }

        res.render("extractedartists/edit", {
            title: "Edit ExtractedArtist",
            extractedartist: extractedartist,
            errors: err.errors
        });
    });
};

/**
 * Show
 */

exports.show = function(req, res) {
    res.render("extractedartists/show", {
        title: req.extractedartist.title,
        extractedartist: req.extractedartist
    });
};

/**
 * Delete an extractedartist
 */

exports.destroy = function(req, res) {
    var extractedartist = req.extractedartist;
    extractedartist.remove(function(err) {
        req.flash("info", "Deleted successfully")
        res.redirect("/extractedartists")
    });
};
