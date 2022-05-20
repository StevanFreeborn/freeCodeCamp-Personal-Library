const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    bookId: { type: String },
    comment: { type: String, required: true, trim: true }
});

const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;