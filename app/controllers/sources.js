module.exports = function(ukiyoe) {

var Source = ukiyoe.db.model("Source"),
    utils = require("../../lib/utils"),
    _ = require("lodash"),
    sourceTypes = require("../../data/source-types.json"),
    sourceTypeMap = {},
    exports = {},
    numColumns = 4;

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
            if (source.numPrints) {
                total += source.numPrints;
                clusterSource(source, activeSources);

            } else if (source.estNumPrints) {
                totalEstimated += source.estNumPrints;
                clusterSource(source, estimatedSources);
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

return exports;
};