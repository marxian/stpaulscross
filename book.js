var mongoose = require('mongoose'),
	 schemae = {},
	 models = {};

mongoose.connect(process.env.MONGOLAB_URI);

schemae.bookSchema = new mongoose.Schema(
    {
        title: String,
        STC: String,
        year: Number,
        collophon: String
    }
);

schemae.bookSchema.index({year: 1});
schemae.bookSchema.index({collophon: 'text'});

models.Book = mongoose.model('Book', schemae.bookSchema);

module.exports.schemae = schemae;
module.exports.models = models;