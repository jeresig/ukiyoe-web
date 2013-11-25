
/*!
 * Module dependencies.
 */

exports.index = function (req, res) {
    res.render("home", {
        page_title: "Home Page"
    });
};
