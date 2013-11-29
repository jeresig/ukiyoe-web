/*!
 * Module dependencies.
 */

var should = require("should");
var data = require("./test-bio-match-data");

var mongoose = require("mongoose"),
    Bio = require("../app/models/bio"),
    Artist = require("../app/models/artist");

var a, b;

before(function (done) {
    a = new Bio();
    b = new Bio();

    done();
});

describe("Name Match", function () {
    var names = Object.keys(data.names);

    for (var i = 0; i < names.length - 1; i++) {
        var name = names[i];

        for (var j = i + 1; j < names.length; j++) {
            var otherName = names[j];

            (function(name, otherName){

                it(name + " vs. " + otherName, function(done) {
                    a.name = data.names[name];
                    b.name = data.names[otherName];
                    var expected = data.nameMatches[name][otherName];
                    should(a.nameMatches(b)).eql(expected);
                    done();
                });
            
            })(name, otherName);
        }
    }
});

describe("Date Match", function () {
    var dates = Object.keys(data.dates);

    for (var d = 0; d < dates.length; d++) {
        var date = dates[d];

        for (var e = d + 1; e < dates.length; e++) {
            var otherDate = dates[e];
            
            (function(date, otherDate){

                it("life " + date + " vs. " + otherDate, function(done) {
                    a.life = data.dates[date];
                    a.active = null;
                    b.life = data.dates[otherDate];
                    b.active = null;
                    var expected = data.dateMatches[date][otherDate];
                    should(a.dateMatches(b)).eql(expected);
                    done();
                });

                it("strong active " + date + " vs. " + otherDate, function(done) {
                    a.active = data.dates[date];
                    a.life = data.dates.all;
                    b.active = data.dates[otherDate];
                    b.life = data.dates.all;
                    should(a.dateMatches(b)).eql(2);
                    done();
                });

                it("weak active " + date + " vs. " + otherDate, function(done) {
                    a.active = data.dates[date];
                    a.life = data.dates.all;
                    b.active = data.dates[otherDate];
                    b.life = data.dates.startOnly;
                    var expected = Math.min(2, data.dateMatches[date][otherDate] + 1);
                    should(a.dateMatches(b)).eql(expected);
                    done();
                });
                
                it("normal active " + date + " vs. " + otherDate, function(done) {
                    a.active = data.dates[date];
                    a.life = null;
                    b.active = data.dates[otherDate];
                    b.life = null;
                    var expected = data.dateMatches[date][otherDate];
                    should(a.dateMatches(b)).eql(expected);
                    done();
                });

            })(date, otherDate);
        }
    }
});

describe("Bio Match", function () {
    data.bioMatches.name.forEach(function(namePair, nameExpected) {
        data.bioMatches.date.forEach(function(datePair, dateExpected) {
            it("bio matches " + namePair + " " + datePair, function(done) {
                a.name = data.names[namePair[0]];
                b.name = data.names[namePair[1]];
                a.life = data.dates[datePair[0]];
                b.life = data.dates[datePair[1]];

                should(a.nameMatches(b)).eql(nameExpected, "Verify name matching.");
                should(a.dateMatches(b)).eql(dateExpected, "Verify date matching.");

                var expected = nameExpected;
                if (expected > 0) {
                    expected += dateExpected - 1;
                }
                expected = Math.min(2, expected);
                should(a.matches(b)).eql(expected);
                done();
            });
        });
    });
});

describe("Alias Match", function () {
    data.bioMatches.name.forEach(function(aliasPair, aliasExpected) {
        data.bioMatches.date.forEach(function(datePair, dateExpected) {
            it("alias matches " + aliasPair + " " + datePair, function(done) {
                a.name = data.names[aliasPair[0]];
                b.name = data.names.en;
                a.aliases = [];
                b.aliases = [data.names[aliasPair[1]]];
                a.life = data.dates[datePair[0]];
                b.life = data.dates[datePair[1]];

                should(a.aliasMatches(b)).eql(aliasExpected, "Verify alias matching.");
                should(a.dateMatches(b)).eql(dateExpected, "Verify date matching.");

                var expected = aliasExpected;
                if (expected > 0) {
                    expected += dateExpected - 1;
                }
                expected = Math.min(2, expected);
                should(a.matches(b)).eql(expected);
                done();
            });
        });
    });
});

after(function (done) {
    done();
});
