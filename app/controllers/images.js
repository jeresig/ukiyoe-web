
/**
 * Module dependencies.
 */
module.exports = function(ukiyoe) {

var Image = ukiyoe.db.model("Image"),
    utils = require("../../lib/utils"),
    _ = require("lodash"),
    exports = {};

/**
 * Load
 */

exports.load = function(req, res, next, id) {
    Image.load(id, function(err, image) {
        if (err) {
            return next(err);
        }
        if (!image) {
            return next(new Error("not found"));
        }
        req.image = image;
        next();
    });
};

/**
 * Search
 */

exports.search = function(req, res) {
    var page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
    var perPage = 100;
    var q = req.param("q") || "";

    var query = {
        query_string: {
            query: q
        },
        filtered: {
            filter: {},
            size: perPage,
            from: page * perPage,
            "sort": [
                {
                    "dateCreated.start": {
                        "order": "asc"
                    }
                },
                {
                    "dateCreated.end": {
                        "order": "asc"
                    }
                }
            ]
        }
    };

    if (req.param("startDate") && req.param("endDate")) {
        query.filtered.filter.and = [
            {
                range: {
                    "dateCreated.start": {
                        gte: parseFloat(req.param("startDate")),
                        lte: parseFloat(req.param("endDate"))
                    }
                }
            },
            {
                range: {
                    "dateCreated.end": {
                        gte: parseFloat(req.param("startDate")),
                        lte: parseFloat(req.param("endDate"))
                    }
                }
            }
        ];
    }

    Image.search({query: query}, {hydrate: true, hydrateOptions: {populate: "artists.artist"}}, function(err, results){
        if (err) {
            console.error(err);
            return res.render("500");
        }

        res.render("images/index", {
            title: "Images",
            q: req.param("q"),
            startDate: req.param("startDate") || "1765",
            endDate: req.param("endDate") || "1868",
            images: results.hits,
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
    var perPage = 100;
    var options = {
        query: "fish",
        size: perPage,
        from: page * perPage
    };

    // , hydrateOptions: {populate: "bios"}
    Image.search(options, {hydrate: true}, function(err, results){
        if (err) {
            return res.render("500");
        }

        res.render("images/index", {
            title: "Images",
            images: results.hits,
            page: page + 1,
            pages: Math.ceil(results.total / perPage)
        });
    });
};

/**
 * New image
 */

exports.new = function(req, res) {
    res.render("images/new", {
        title: "New Image",
        image: new Image({})
    });
};

/**
 * Create an image
 */

exports.create = function(req, res) {
    var image = new Image(req.body);
    image.user = req.user;

    image.save(function(err) {
        if (!err) {
            req.flash("success", "Successfully created image!");
            return res.redirect("/images/" + image._id);
        }

        res.render("images/new", {
            title: "New Image",
            image: image,
            errors: utils.errors(err.errors || err)
        });
    });
};

/**
 * Edit an image
 */

exports.edit = function(req, res) {
    res.render("images/edit", {
        title: "Edit " + req.image.title,
        image: req.image
    });
};

/**
 * Update image
 */

exports.update = function(req, res) {
    var image = req.image;
    image = _.extend(image, req.body);

    image.save(function(err) {
        if (!err) {
            return res.redirect("/images/" + image._id);
        }

        res.render("images/edit", {
            title: "Edit Image",
            image: image,
            errors: err.errors
        });
    });
};

/**
 * Show
 */

exports.show = function(req, res) {
    res.render("images/show", {
        //title: req.image.title,
        image: req.image
    });
};

/**
 * Delete an image
 */

exports.destroy = function(req, res) {
    var image = req.image;
    image.remove(function(err) {
        req.flash("info", "Deleted successfully")
        res.redirect("/images")
    });
};

return exports;
};