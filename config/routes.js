var auth = require("./middlewares/authorization");
var users = require("../app/controllers/users");
var extractedartists = require("../app/controllers/extractedartists");
var artists = require("../app/controllers/artists");

var extractedartistAuth = [
    auth.requiresLogin
];

var artistAuth = [
    auth.requiresLogin
];

var passportOptions = {
    failureFlash: "Invalid email or password.",
    failureRedirect: "/login"
};

module.exports = function (app, passport) {
    app.get("/login", users.login);
    app.get("/signup", users.signup);
    app.get("/logout", users.logout);
    app.post("/users", users.create);
    app.post("/users/session", passport.authenticate("local", passportOptions),
        users.session);
    app.get("/users/:userId", users.show);

    app.param("userId", users.user);

    app.get("/extracted/artists", extractedartists.index);
    app.get("/extracted/artists/new", auth.requiresLogin, extractedartists.new);
    app.post("/extracted/artists", auth.requiresLogin, extractedartists.create);
    app.get("/extracted/artists/:eaId", extractedartists.show);
    app.get("/extracted/artists/:eaId/edit", extractedartistAuth, extractedartists.edit);
    app.put("/extracted/artists/:eaId", extractedartistAuth, extractedartists.update);
    app.del("/extracted/artists/:eaId", extractedartistAuth, extractedartists.destroy);

    app.param("eaId", extractedartists.load);

    app.get("/artists", artists.index);
    app.get("/artists/new", auth.requiresLogin, artists.new);
    app.post("/artists", auth.requiresLogin, artists.create);
    app.get("/artists/:eaId", artists.show);
    app.get("/artists/:eaId/edit", artistAuth, artists.edit);
    app.put("/artists/:eaId", artistAuth, artists.update);
    app.del("/artists/:eaId", artistAuth, artists.destroy);

    app.param("artistId", artists.load);

    app.get("/", artists.index);
};
