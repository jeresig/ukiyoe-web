/*!
 * Module dependencies.
 */

var should = require("should");
var data = require("./name-data");

var mongoose = require("mongoose"),
    Bio = require("../app/models/bio"),
    Artist = require("../app/models/artist");

var a, b;

before(function (done) {
    a = new Bio();
    b = new Bio();

    done();
});

describe("Bio Match", function () {
    it("Generate names", function (done) {
        var names = Object.keys(data.names);
        var dates = Object.keys(data.dates);

        for (var i = 0; i < names.length - 1; i++) {
            var name = names[i];
            a.name = data.names[name];

            for (var d = 0; d < dates.length; d++) {
                var date = dates[d];
                a.life = data.dates[date];

                for (var j = i + 1; j < names.length; j++) {
                    var otherName = names[j];
                    b.name = data.names[otherName];

                    for (var e = d + 1; e < dates.length; e++) {
                        var otherDate = dates[e];
                        b.life = data.dates[otherDate];
                        console.log(name, date, "life", otherName, otherDate, "life");
                        b.active = data.dates[otherDate];
                        console.log(name, date, "life", otherName, otherDate, "active");
                    }
                }

                a.active = data.dates[date];
            
                for (var j = i + 1; j < names.length; j++) {
                    var otherName = names[j];
                    b.name = data.names[otherName];

                    for (var e = d + 1; e < dates.length; e++) {
                        var otherDate = dates[e];
                        b.life = data.dates[otherDate];
                        console.log(name, date, "active", otherName, otherDate, "life");
                        b.active = data.dates[otherDate];
                        console.log(name, date, "active", otherName, otherDate, "active");
                    }
                }
            }
        }

        // fill the test
        done();
    });
});

after(function (done) {
    done();
});
