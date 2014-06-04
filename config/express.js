
/*!
 * Module dependencies.
 */

var express = require("express");
var i18n = require("i18n-2");
var mongoStore = require("connect-mongo")(express);
var helpers = require("view-helpers");
var pkg = require("../package");
var flash = require("connect-flash");
var env = process.env.NODE_ENV || "development";
var swig = require("swig");

/*!
 * Expose
 */

module.exports = function(app, config, passport) {
    // Add basic auth for staging
    if (env === "staging") {
        app.use(express.basicAuth(function(user, pass) {
            return "username" === user & "password" === pass;
        }));

        app.use(function (req, res, next) {
            if (req.remoteUser && req.user && !req.user._id) {
                delete req.user;
            }
            next();
        });
    }

    var CDN = require("express-cdn")(app, {
        publicDir: config.root + "/public",
        viewsDir: config.root + "views/layouts",
        extensions: [".swig"],
        endpoint: config.s3.endpoint,
        domain: config.s3.staticBucket,
        bucket: config.s3.staticBucket,
        key: config.s3.key,
        secret: config.s3.secret,
        hostname: "localhost",
        port: config.server.port,
        ssl: false,
        production: env === "production"
    });

    app.set("showStackError", true);

    // use express favicon
    app.use(express.favicon());

    app.use(express.static(config.root + "/public"));
    app.use(express.logger("dev"));

    app.engine("swig", swig.renderFile)

    // views config
    app.set("views", config.root + "/app/views");
    app.set("view engine", "swig");

    app.set("view cache", false);
    swig.setDefaults({ cache: false });

    app.configure(function () {
        // bodyParser should be above methodOverride
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        // cookieParser should be above session
        app.use(express.cookieParser());
        app.use(express.session({
            secret: pkg.name,
            store: new mongoStore({
                url: config.db,
                collection : "sessions"
            })
        }));

        // Passport session
        app.use(passport.initialize());
        app.use(passport.session());

        // Flash messages
        app.use(flash());

        // expose pkg and node env to views
        app.use(function (req, res, next) {
            res.locals.pkg = pkg
            res.locals.env = env
            next();
        });

        // View helpers
        app.use(helpers(pkg.name));

        // adds CSRF support
        if (process.env.NODE_ENV !== "test") {
            app.use(express.csrf());

            app.use(function(req, res, next) {
                res.locals.csrf_token = req.csrfToken();
                next();
            });
        }

        i18n.expressBind(app, {
            locales: ["en"]
        });

        app.use(function(req, res, next) {
            res.locals.CDN = CDN(req, res);

            var otherLocale = function(req) {
                return req.i18n.getLocale() === "en" ? "ja" : "en";
            };

            res.locals.getOtherURL = function() {
                return site.genURL(otherLocale(req), req.path);
            };

            res.locals.curLocale = function(req) {
                return req.i18n.getLocale();
            };

            res.locals.URL = function(req) {
                return function(path) {
                    return path.getURL ?
                        path.getURL(req.i18n.getLocale()) :
                        site.genURL(req.i18n.getLocale(), path);
                }
            };

            res.locals.fullName = function(item) {
                return item.getFullName(req.i18n.getLocale());
            };

            res.locals.shortName = function(req) {
                return function(item) {
                    return item.getShortName(req.i18n.getLocale());
                };
            };

            res.locals.getTitle = function(req) {
                return function(item) {
                    return item.getTitle(req.i18n.getLocale());
                };
            };

            next();
        });

        // routes should be at the last
        app.use(app.router);

        // custom error handler
        app.use(function (err, req, res, next) {
            if (err.message
                && (~err.message.indexOf("not found")
                || (~err.message.indexOf("Cast to ObjectId failed")))) {
                return next();
            }

            console.error(err.stack);
            res.status(500).render("500");
        })

        app.use(function (req, res, next) {
            res.status(404).render("404", { url: req.originalUrl });
        });
    })

    // development specific stuff
    app.configure("development", function () {
        app.locals.pretty = true;
    });

    // staging specific stuff
    app.configure("staging", function () {
        app.locals.pretty = true;
    });
};
