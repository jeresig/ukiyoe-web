var auth = require("./middlewares/authorization");
var users = require("../app/controllers/users");
var bios = require("../app/controllers/bios");
var artists = require("../app/controllers/artists");
var images = require("../app/controllers/images");

var extractedartistAuth = [
    auth.requiresLogin
];

var artistAuth = [
    auth.requiresLogin
];

var imageAuth = [
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

    app.get("/bios", bios.index);
    app.get("/bios/new", auth.requiresLogin, bios.new);
    app.post("/bios", auth.requiresLogin, bios.create);
    app.get("/bios/:bioId", bios.show);
    app.get("/bios/:bioId/edit", extractedartistAuth, bios.edit);
    app.put("/bios/:bioId", extractedartistAuth, bios.update);
    app.del("/bios/:bioId", extractedartistAuth, bios.destroy);

    app.param("bioId", bios.load);

    app.get("/artists", artists.index);
    app.get("/artists/new", auth.requiresLogin, artists.new);
    app.post("/artists", auth.requiresLogin, artists.create);
    app.get("/artists/:artistId", artists.show);
    app.get("/artists/:artistId/edit", artistAuth, artists.edit);
    app.put("/artists/:artistId", artistAuth, artists.update);
    app.del("/artists/:artistId", artistAuth, artists.destroy);

    app.param("artistId", artists.load);

    app.get("/images", images.index);
    app.get("/images/search", images.search);
    app.get("/images/new", auth.requiresLogin, images.new);
    app.post("/images", auth.requiresLogin, images.create);
    app.get("/images/:artistId", images.show);
    app.get("/images/:artistId/edit", imageAuth, images.edit);
    app.put("/images/:artistId", imageAuth, images.update);
    app.del("/images/:artistId", imageAuth, images.destroy);

    app.param("imageId", images.load);

    app.get("/", artists.search);
};
