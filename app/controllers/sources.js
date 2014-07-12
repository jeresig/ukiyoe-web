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
    var start = parseFloat(req.query.start || 0);
    var rows = 100;
    var q = req.param("q") || "";

    var query = {
        term: {
            source: req.source._id.toString()
        },
        filtered: {
            filter: {},
            size: rows,
            from: start
        }
    };

    Image.search({query: query}, {hydrate: true, hydrateOptions: {populate: "artists.artist"}}, function(err, results){
        if (err) {
            console.error(err);
            return res.render("500");
        }

        var matches = results.hits.length;
		var end = start + matches;
		var urlPrefix = req.path + (req.query.q ?
			"?" + qs.stringify({ q: req.query.q }) : "");
		var sep = req.query.q ? "&" : "?";

		var prevLink = null;
		var nextLink = null;

		if (start > 0) {
			prevLink = app.genURL(req.i18n.getLocale(), urlPrefix +
				(start - rows > 0 ?
					sep + "start=" + (start - rows) : ""));
		}

		if (end < results.total) {
			nextLink = app.genURL(req.i18n.getLocale(), urlPrefix +
				sep + "start=" + (start + rows));
		}

        res.render("images/index", {
            title: "Images",
            q: req.param("q"),
            startDate: req.param("startDate") || "1765",
            endDate: req.param("endDate") || "1868",
            images: results.hits,
            total: results.total,
			start: start || 1,
			end: end,
			rows: rows,
			prev: prevLink,
			next: nextLink
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