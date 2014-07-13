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
    return app.genURL(locale, "/source/" + this._id);
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
    app.imageSearch(req, res, {
        term: {
            source: req.source._id.toString()
        }
    }, {
        title: req.source.name,
        url: req.source.url
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