var testPage = function(opt) {
	this.test.assertUrlMatch(opt.url, "Search term is in URL");
	this.test.assertTitle(opt.title, "Title Check");

	this.test.assertEval(function(term) {
		return document.querySelector("#q").value === term;
	}, "Check that the search field is filled correctly.", opt.term);

	this.test.assertEval(function() {
		var num = parseFloat(document.querySelector("span.total strong")
			.innerHTML.replace(/,/, ""));
		return num > 4000;
	}, "Check number of results");

	this.test.assertSelectorHasText("span.page",
		opt.prev === -1 ? "Viewing prints 1 to 100." :
		opt.prev === 0 ? "Viewing prints 100 to 200." :
		opt.prev === 100 ? "Viewing prints 200 to 300." : "",
		"Verify that the Viewing Prints message is correct.");

	this.test.assertEval(function() {
		return /\/image\/\w+\/.+$/.test(
			document.querySelector("div.img a").href);
	}, "Check link is to the right page.");

	if (opt.artistURL) {
		this.test.assertEval(function(url) {
			return document.querySelector("div.img a.artist").href
			 	.indexOf(url) >= 0;
		}, "Check link to the artist page is correct.", opt.artistURL);
	}

	this.test.assertEval(function() {
		return document.querySelector("div.img a.source").href
		 	.indexOf("/source/") >= 0;
	}, "Check link to the source page exists.");

	this.test.assertEval(function() {
		return document.querySelectorAll("div.img").length === 100;
	}, "Check that all the results are being shown.");

	if (opt.prev === -1) {
		this.test.assertDoesntExist("span.prev a",
			"Make sure previous link doesn't exist.");
	} else {
		this.test.assertEval(function(prev) {
			var href = document.querySelector("span.prev a").href;

			return prev === 0 ?
				href.indexOf("start=") < 0 :
				href.indexOf("start=" + prev) >= 0;
		}, "Verify prev link.", opt.prev);
	}

	this.test.assertEval(function(next) {
		return document.querySelector("span.next a").href
			.indexOf("start=" + next) >= 0;
	}, "Verify next link.", opt.next);
};

// Test performing a search

var artistURL = "/artists/katsushika-hokusai/535e864d4e4ee5000063bcf7";

casper.start("http://localhost:3000", function() {
	// Test the search box on the home page
	this.fill(".form-search", {
		q: "hokusai"
	}, true);
});

casper.then(function() {
	testPage.call(this, {
		url: "search\?q=hokusai",
		title: "Results for 'hokusai' - Ukiyo-e Search",
		term: "hokusai",
		artistURL: artistURL,
		prev: -1,
		next: 100
	});
	this.click("span.next a");
});

casper.then(function() {
	testPage.call(this, {
		url: "search\?q=hokusai",
		title: "Results for 'hokusai' - Ukiyo-e Search",
		term: "hokusai",
		artistURL: artistURL,
		prev: 0,
		next: 200
	});
	this.click("span.next a");
});

casper.then(function() {
	testPage.call(this, {
		url: "search\?q=hokusai",
		title: "Results for 'hokusai' - Ukiyo-e Search",
		term: "hokusai",
		artistURL: artistURL,
		prev: 100,
		next: 300
	});
});

// Test Loading an Artist's Page

casper.thenOpen("http://localhost:3000" + artistURL);

casper.then(function() {
	testPage.call(this, {
		url: artistURL,
		title: "Katsushika Hokusai - Ukiyo-e Search",
		term: "",
		artistURL: artistURL,
		prev: -1,
		next: 100
	});
	this.click("span.next a");
});

casper.then(function() {
	testPage.call(this, {
		url: artistURL,
		title: "Katsushika Hokusai - Ukiyo-e Search",
		term: "",
		artistURL: artistURL,
		prev: 0,
		next: 200
	});
	this.click("span.next a");
});

casper.then(function() {
	testPage.call(this, {
		url: artistURL,
		title: "Katsushika Hokusai - Ukiyo-e Search",
		term: "",
		artistURL: artistURL,
		prev: 100,
		next: 300
	});
});

// Test Loading a Source Page

casper.thenOpen("http://localhost:3000/source/met");

casper.then(function() {
	testPage.call(this, {
		url: "/source/met",
		title: "Metropolitan Museum of Art - Ukiyo-e Search",
		term: "",
		prev: -1,
		next: 100
	});
	this.click("span.next a");
});

casper.then(function() {
	testPage.call(this, {
		url: "/source/met",
		title: "Metropolitan Museum of Art - Ukiyo-e Search",
		term: "",
		prev: 0,
		next: 200
	});
	this.click("span.next a");
});

casper.then(function() {
	testPage.call(this, {
		url: "/source/met",
		title: "Metropolitan Museum of Art - Ukiyo-e Search",
		term: "",
		prev: 100,
		next: 300
	});
});

casper.run(function() {
	this.test.done(96);
});