var express = require("express");
var passport = require("passport");
var env = process.env.NODE_ENV || "development";
var config = require("./config/config")[env];
var fs = require("fs");

require("express-namespace");

var ukiyoe = require("ukiyoe-models");

ukiyoe.db.connect(function() {
    fs.readdirSync(__dirname + "/app/models").forEach(function (file) {
        if (~file.indexOf(".js")) {
            require(__dirname + "/app/models/" + file)(ukiyoe);
        }
    });

    // Bootstrap passport config
    require("./config/passport")(passport, config, ukiyoe);

    var app = express();

    // Bootstrap application settings
    require("./config/express")(app, config, passport);

    // Bootstrap routes
    require("./config/routes")(app, passport, ukiyoe);

    // Start the app by listening on <port>
    var port = process.env.PORT || config.server.port;

    console.log("PORT: " + port);

    app.listen(port, function() {
        if (process.send) {
            process.send("online");
        }
    });

    process.on("message", function(message) {
        if (message === "shutdown") {
            process.exit(0);
        }
    });
});
