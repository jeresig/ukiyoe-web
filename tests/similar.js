var fs = require("fs");

var totalTests = 0;

var goodFile = fs.absolute("tests/DP141256.jpg");
var goodURL = "http://data.ukiyo-e.org/met/scaled/DP141256.jpg";
var badFile = fs.absolute("public/images/john-medium.jpg");
var badURL = "http://farm4.static.flickr.com/3396/3450728563_69b0bd0743_m.jpg";

var testUpload = function(params, good) {
	totalTests += 4;
	params.test = "1"; 

	casper.then(function() {
		// Test the search box on the home page
		this.fill("form.upload", params, true);
	});

	casper.then(function() {
		this.test.assertMatch(this.getCurrentUrl(), /\/upload\/test-[a-f0-9]+$/,
			"Verify that we're on an upload page.");

		this.test.assertResourceExists(function(resource) {
			return /\/uploads\/scaled\/test-[a-f0-9]+.jpg$/.test(resource.url);
		}, "Make sure the uploaded, scaled, image exists.");

		if (good) {
			this.test.assertExists("div.img",
				"Make sure there are some results.");
		} else {
			this.test.assertDoesntExist("div.img",
				"Make sure there aren't some results.");
		}

		// Visit the uploaded image to make sure it exists
		this.click(".imageholder a");
	});

	casper.then(function() {
		this.test.assertMatch(this.getCurrentUrl(),
			/\/uploads\/images\/test-[a-f0-9]+.jpg$/,
			"Verify that the full image was uploaded properly.");
	});
};

casper.start("http://localhost:3000");
testUpload({file: goodFile}, true);

casper.thenOpen("http://localhost:3000");
testUpload({file: badFile}, false);

casper.thenOpen("http://localhost:3000");
testUpload({url: goodURL}, true);

casper.thenOpen("http://localhost:3000");
testUpload({url: badURL}, false);

// TODO: Test bad uploads
// Not a JPG
// Too large a file
// URL doesn't exist
// File doesn't exist

var testSimilar = function(options) {
	totalTests += 12;

	var parts = options.id.split("/");
	var image = "http://data.ukiyo-e.org/" + parts[0] + "/images/" +
		parts[1] + ".jpg";
	var scaled = "http://data.ukiyo-e.org/" + parts[0] + "/scaled/" +
		parts[1] + ".jpg";

	casper.then(function() {
		this.test.info("Testing: " + options.id);

		// Test that the artist is correct
		this.test.assertSelectorHasText("p.artist a", options.artistName,
			"Test that artist name is correct.");

		this.test.assertMatch(casper.getElementAttribute("p.artist a", "href"),
			new RegExp(options.artistLink), "Test that artist URL is correct.");

		// Test that title exists
		this.test.assertExists("p.title", "Make sure that the title exists.");

		// Test that date exists
		this.test.assertExists("p.date", "Make sure that the date exists.");

		// Test that details link is correct
		if (options.detailsLink) {
			this.test.assertEquals(
				casper.getElementAttribute("p.details a", "href"),
				options.detailsLink, "Test that details link is correct.");

		} else {
			this.test.assertDoesntExist("p.details a",
				"Details link doesn't exist.");
		}

		// Test that the details header text is correct
		if (options.commercial) {
			this.test.assertSelectorHasText("p.details .span1",
				"Prices:",
				"Test that details header text is correct.");

			if (options.detailsLink) {
				this.test.assert(
					!!casper.getElementAttribute("p.details a", "title"),
					"Test that the link as a title attribute.");

				totalTests += 1;
			}
		} else {
			this.test.assertSelectorHasText("p.details .span1",
				"Details:",
				"Test that details header text is correct.");
		}

		// Test that details text is correct
		this.test.assertSelectorHasText("p.details", options.detailsText,
			"Test that details text is correct.");

		// Test that source link is correct
		if (options.sourceLink) {
			this.test.assertEquals(
				casper.getElementAttribute("p.source a", "href"),
				options.sourceLink, "Test that source link is correct.");
		} else {
			totalTests -= 1;
		}

		// Test that browse source link is correct
		this.test.assertMatch(
			casper.getElementAttribute("p.source a:last-child", "href"),
			new RegExp("/source/" + options.source),
			"Test that browse source link is correct.");

		// Test that the scaled image has loaded
		this.test.assertResourceExists(function(resource) {
			return scaled === resource.url;
		}, "Make sure the scaled image exists.");

		// Test that there are results
		if (options.noResults) {
			this.test.assertDoesntExist("div.img",
				"Make sure there aren't some results.");
		} else {
			this.test.assertExists("div.img",
				"Make sure there are some results.");
		}

		// Visit the full image to make sure it exists
		this.click(".imageholder a");
	});

	casper.then(function() {
		// Test that the full size image is working
		this.test.assertEquals(this.getCurrentUrl(), image,
			"Verify that the full image exists.");
	});
};

// Normal
casper.thenOpen("http://localhost:3000/image/met/DP141256")
testSimilar({
	id: "met/DP141256",
	artistLink: "/artist/katsushika-hokusai",
	artistName: "Katsushika Hokusai",
	detailsLink: "http://www.metmuseum.org/Collections/search-the-collections/60027292",
	detailsText: "More information...",
	sourceLink: "http://www.metmuseum.org/collections",
	source: "met"
});

// Dealer
casper.thenOpen("http://localhost:3000/image/artelino/9966g1")
testSimilar({
	id: "artelino/9966g1",
	artistLink: "/artist/katsushika-hokusai",
	artistName: "Katsushika Hokusai",
	detailsText: "Katsushika Hokusai: Mishima Pass - Fugaku Sanju-rokkei - Artelino",
	detailsLink: "http://www.artelino.com/archive/archivesearch_show.asp?act=go&sor=itm_item_id%20ASC&sea=9966",
	commercial: true,
	sourceLink: "http://artelino.com/",
	source: "artelino"
});

// No link
casper.thenOpen("http://localhost:3000/image/famsf/5050161212750064")
testSimilar({
	id: "famsf/5050161212750064",
	artistLink: "/artist/katsushika-hokusai",
	artistName: "Katsushika Hokusai",
	detailsText: "no way to link",
	sourceLink: "http://legionofhonor.famsf.org/search-collections",
	source: "famsf"
});

// Source no longer exists
casper.thenOpen("http://localhost:3000/image/wbp/826229376")
testSimilar({
	id: "wbp/826229376",
	artistLink: "/artist/katsushika-hokusai",
	artistName: "Katsushika Hokusai",
	detailsText: "no longer exists",
	commercial: true,
	source: "wbp"
});

// TODO: Test page with no results
// Test page with no artist/title/date

casper.run(function() {
	this.test.done(totalTests);
});
