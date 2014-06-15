module.exports = function(ukiyoe, app) {

var Source = ukiyoe.db.model("Source"),
    Image = ukiyoe.db.model("Image"),
    utils = require("../../lib/utils"),
    _ = require("lodash"),
    sourceTypes = require("../../data/source-types.json"),
    sourceTypeMap = {},
    exports = {},
    numColumns = 4;


Source.prototype.getURL = function(locale) {
    return app.genURL(locale, "source/" + this._id);
};

sourceTypes.forEach(function(type) {
    // Create a mapping for the source types
    sourceTypeMap[type.type] = type.name;
});

var clusterSource = function(source, cluster) {
    source.types.forEach(function(type) {
        if (!cluster[type]) {
            cluster[type] = [[]];
        }

        // Get most recently created row
        curRow = cluster[type][ cluster[type].length - 1 ];

        if (curRow.length === numColumns) {
            curRow = [];
            cluster[type].push(curRow);
        }

        curRow.push(source);
    });
};

exports.index = function(req, res) {
    Source.find({}, function(err, sources) {
        if (err) {
            return res.render("500");
        }

        var total = 0;
        var totalEstimated = 0;
        var activeSources = {};
        var estimatedSources = {};

        sources.forEach(function(source) {
            if (source.estNumPrints) {
                totalEstimated += source.estNumPrints;
                clusterSource(source, estimatedSources);
            } else {
                total += source.numPrints;
                clusterSource(source, activeSources);
            }
        });

        res.render("sources/index", {
            title: req.i18n.__("Sources of Japanese Woodblock Prints"),
            sourceTypes: sourceTypes,
            sourceTypeMap: sourceTypeMap,
            activeSources: activeSources,
            estimatedSources: estimatedSources,
            total: total,
            totalEstimated: totalEstimated
        });
    });
};

exports.show = function(req, res) {
    var page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
    var perPage = 100;
    var q = req.param("q") || "";

    var query = {
        query_string: {
            // NOTE: There has got to be a better way to do this.
            query: "source:" + req.source._id
        },
        filtered: {
            filter: {},
            size: perPage,
            from: page * perPage,
        }
    };

    Image.search({query: query}, {hydrate: true, hydrateOptions: {populate: "artists.artist"}}, function(err, results){
        if (err) {
            console.error(err);
            return res.render("500");
        }

        console.log(results)

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

exports.load = function(req, res, next, id) {
    Source.findById(id, function(err, source) {
        if (err) {
            return next(err);
        }
        if (!source) {
            return next(new Error("not found"));
        }
        req.source = source;
        next();
    });
};

return exports;
};