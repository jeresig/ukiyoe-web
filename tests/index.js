casper.start("http://localhost:3000", function() {
	this.test.assertTitle("Japanese Woodblock Print Search - Ukiyo-e Search", "Title Expected");
});

casper.run(function() {
	this.test.done(1);
});