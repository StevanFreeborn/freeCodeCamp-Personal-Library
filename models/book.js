const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: { type: String, required: true, trim: true },
    commentcount: { type: Number, default: 0 },
});

const Issue = mongoose.model('books', BookSchema);

module.exports = Issue;