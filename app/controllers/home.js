
/*!
 * Module dependencies.
 */
module.exports = function(ukiyoe) {

var exports = {};

exports.index = function (req, res) {
    res.render("home", {
        page_title: "Home Page"
    });
};

return exports;
};