
/*
 *    Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect("/login");
    }
    next();
};

/*
 *    User authorization routing middleware
 */
exports.user = {
    hasAuthorization: function (req, res, next) {
        if (req.profile.id !== req.user.id) {
            req.flash("info", "You are not authorized");
            return res.redirect("/users/" + req.profile.id);
        }
        next();
    }
};

/*
 *    Article authorization routing middleware
 */
exports.extractedartist = {
    hasAuthorization: function (req, res, next) {
        if (req.article.user.id !== req.user.id) {
            req.flash("info", "You are not authorized");
            // TODO: Switch to generating the URL from a method.
            return res.redirect("/extracted/artist/" + req.article.id);
        }
        next();
    }
};
