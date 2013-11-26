var auth = require("./middlewares/authorization");
var users = require("../app/controllers/users");
var extractedartists = require("../app/controllers/extractedartists");

var extractedartistAuth = [
    auth.requiresLogin,
    auth.extractedartist.hasAuthorization
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

    app.get("/", extractedartists.index);
};
