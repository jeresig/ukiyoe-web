
/*!
 * Module dependencies.
 */
module.exports = function(ukiyoe) {

var exports = {};

exports.index = function (req, res) {
    res.render("home/index");
};

exports.about = function (req, res) {
    res.render("home/about");
};

return exports;
};