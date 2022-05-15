const mongoose = require('mongoose');
const { CommentSchema } = require('./comment');

const BookSchema = mongoose.Schema({
    title: {type: String, required: true, trim: true},
    commentcount: {type: Number },
    comments: {type: [String]}

});

const Issue = mongoose.model('books', BookSchema);

module.exports = Issue;