var express = require('express');
var mongoose = require('mongoose');
var book = require('./book.js').models.Book;
var app = express();
var stalls = require('./stalls.json');
var serveStatic = require('serve-static');

mongoose.connect(process.env.MONGOLAB_URI, function(err){
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
		book.find(
			q,
			function(err, result){
				if (err) {
					res.render('error', error_msg);
				}
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