/*!
 * Module dependencies.
 */

var should = require("should");
var _ = require("lodash");
var data = require("./test-bio-match-data");

var mongoose = require("mongoose"),
    Bio = require("../app/models/bio"),
    Artist = require("../app/models/artist");

var a, b;
var rootArtist;

before(function (done) {
    a = new Bio();
    b = new Bio();

    rootArtist = new Artist();

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
                    var expected = data.dateMatches[date][otherDate];
                    if (expected !== undefined) {
                        expected = Math.min(2, expected + 1);
                    } else {
                        expected = 1;
                    }
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
                a.active = null;
                b.active = null;

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
                a.active = null;
                b.active = null;

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

describe("Name Merge", function () {
    var names = Object.keys(data.names);

    for (var i = 0; i < names.length - 1; i++) {
        var name = names[i];

        for (var j = 0; j < names.length; j++) {
            var otherName = names[j];

            (function(name, otherName){

                it("merge " + name + " into " + otherName, function(done) {
                    a.name = data.names[name];
                    rootArtist.name = _.clone(data.names[otherName]);
                    rootArtist.bios = [];
                    rootArtist.aliases = [];

                    var expected = data.nameMerges[name][otherName];
                    var expectedAliases;

                    if (expected === true) {
                        expected = data.names[name];
                    } else if (expected === false) {
                        expected = data.names[otherName];
                    }

                    // Figure out if we're going to have an alias, or not
                    if (rootArtist._isAliasDuplicate(a.name) && otherName !== "none" &&
                            data.nameMerges[name][otherName] === false ||
                            // Hardcode in a single test
                            (name === "jaAll2" && otherName === "kanji4")) {
                        expectedAliases = [data.names[name]];
                    } else {
                        expectedAliases = [];
                    }

                    rootArtist.addBio(a);

                    // Check that name merge went correctly
                    should(JSON.parse(JSON.stringify(rootArtist.name))).eql(expected);

                    // Check aliases
                    var aliasResults = JSON.parse(JSON.stringify(rootArtist.aliases));
                    aliasResults = aliasResults.map(function(alias) {
                        should(alias).have.property("source").should.not.be.empty;
                        should(alias).have.property("_id").should.not.be.empty;
                        return _.omit(alias, ["source", "_id"]);
                    });
                    should(aliasResults).eql(expectedAliases);

                    // Test that merging in a bio does, in fact, cause it to
                    // match the bio.
                    should(rootArtist.matches(a)).not.eql(0);

                    done();
                });

            })(name, otherName);
        }
    }
});

describe("Date Merge", function () {
    var dates = Object.keys(data.dates);

    for (var d = 0; d < dates.length; d++) {
        var date = dates[d];

        for (var e = 0; e < dates.length; e++) {
            var otherDate = dates[e];

            (function(date, otherDate){

                it("merge date " + date + " into " + otherDate, function(done) {
                    a.name = data.names.jaAll;
                    a.life = data.dates[date];
                    rootArtist.name = data.names.jaAll;
                    rootArtist.life = _.clone(data.dates[otherDate]);
                    rootArtist.bios = [];
                    rootArtist.lifeAlt = [];

                    var expected = data.dateMerges[date][otherDate];
                    var expectedAlts;

                    if (expected === true) {
                        expected = data.dates[date];
                    } else if (expected === false) {
                        expected = data.dates[otherDate];
                    }

                    // Figure out if we're going to have an alt date, or not
                    if (rootArtist._isDateDuplicate(a, "life") &&
                            data.dateMerges[date][otherDate] !== true &&
                            // Hardcode in two tests
                            !(date === "startOnly" && otherDate === "endOnly" ||
                            date === "endOnly" && otherDate === "startOnly")) {
                        expectedAlts = [data.dates[date]];
                    } else {
                        expectedAlts = [];
                    }

                    rootArtist.addBio(a);

                    // Check that name merge went correctly
                    should(JSON.parse(JSON.stringify(rootArtist.life)) || {}).eql(expected);

                    // Check alt dates
                    var altResults = JSON.parse(JSON.stringify(rootArtist.lifeAlt));
                    altResults = altResults.map(function(alias) {
                        should(alias).have.property("source").should.not.be.empty;
                        should(alias).have.property("_id").should.not.be.empty;
                        return _.omit(alias, ["source", "_id"]);
                    });
                    should(altResults).eql(expectedAlts);

                    done();
                });

            })(date, otherDate);
        }
    }
});

describe("Merge Bio into Artist", function() {

    it("artist should have merged in aliases", function(done) {
        var bio = new Bio();
        bio.name = data.names.jaAll;
        bio.life = data.dates.all;
        bio.aliases = [data.names.jaAll2, data.names.jaAll3, data.names.kanji];
        var artist = new Artist();
        artist.addBio(bio);
        should(artist.aliases).have.lengthOf(3);
        done();
    });

    it("artist should not have extra aliases", function(done) {
        var bio = new Bio();
        bio.name = data.names.jaNoSurname3;
        var bio2 = new Bio();
        bio2.name = data.names.jaGivenOnly;
        var artist = new Artist();
        artist.addBio(bio);
        artist.addBio(bio2);
        should(artist.aliases).have.lengthOf(0);
        done();
    });

    it("bios with not enough date info should match", function(done) {
        var bio = new Bio();
        bio.name = data.names.jaAll;
        bio.active = data.dates.all;
        var bio2 = new Bio();
        bio2.name = data.names.jaAll;
        bio2.life = data.dates.all;
        should(bio.matches(bio2)).eql(2);
        done();
    });
});

after(function (done) {
    done();
});
