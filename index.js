var express = require('express');
var mongoose = require('mongoose');
var book = require('./book.js').models.Book;
var app = express();
var stalls = require('./stalls.json');
var serveStatic = require('serve-static');

mongoose.connect('mongodb://heroku:hNLm3C4IX0bv8PXCERewbzN6xw3wf6lgu5T8XODETzjzFDDCnf5FQesa0u6QUgzeeHkOuZjUSPs0L0WIgTNvRA@lamppost.1.mongolayer.com:10326,lamppost.0.mongolayer.com:10322/app34723665', function(err){
	throw err;
});
app.set('view engine', 'jade');

app.use(serveStatic('maps', {}));

var error_msg = {
	title: 'So Sorry',
	message: "We've not mapped that bookstall yet"
};
 
app.get('/:year/:stall', function (req, res) {
	try {
		var stall = stalls[req.params.stall.toString()][req.params.year.toString()];
		var q = {
			collophon : { $regex : new RegExp(stall.q, 'i') },
			year: req.params.year
		};
		console.dir(q);
		book.find(
			q,
			function(err, result){
				if (err) {
					res.render('error', error_msg);
				}
				console.log(result);
				//res.send('hello');
				res.render('index', { 
					title: stall.name + ' - ' + req.params.year.toString(),
					books: result
				});
			}
		);
	} catch (e) {
		res.render('error', error_msg);
	}

});
 
app.listen(process.env.PORT);