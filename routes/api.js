'use strict';
const Book = require('../models/book');
const Comment = require('../models/comment');

module.exports = (app) => {

    app.route('/api/books')
        .get(async (req, res) => {

            const books = await Book.find({}).exec();

            const comments = await Comment.find({}).exec();

            const booksWithComments = books.map(book => {

                const bookComments = comments
                    .filter(comment => comment.bookId == book.id)
                    .map(comment => comment.comment);

                return {
                    _id: book.id,
                    title: book.title,
                    commentcount: book.commentcount,
                    comments: bookComments
                };

            });

            return res.status(200).json(booksWithComments);

        })

        .post(async (req, res) => {

            const title = req.body.title;

            if (!title) return res.status(200).send('missing required field title');

            const book = await Book.findOne({ title: title }).exec();

            if (book) return res.status(200).json(book);

            const newBook = new Book({
                title: title
            });

            newBook.save()
                .then(book => {

                    return res.status(200).json(book);

                })
                .catch(err => {

                    console.log(err);

                    return res.status(200).json({
                        error: 'could not save new book'
                    });

                });

        })

        .delete((req, res) => {

            Book.deleteMany({})
                .then(bookDeleteResult => {

                    console.log(`# of books delete: ${bookDeleteResult.deletedCount}`);

                    Comment.deleteMany({})
                        .then(commentDeleteResult => {

                            console.log(`# of comments delete: ${commentDeleteResult.deletedCount}`);

                            return res.status(200).send('complete delete successful');

                        })
                        .catch(err => {

                            if (err) console.log(err);

                            return res.status(200).json({
                                error: 'complete delete unsuccessful'
                            });

                        });

                })
                .catch(err => {

                    if (err) console.log(err);

                    return res.status(200).json({
                        error: 'complete delete unsuccessful'
                    });

                });

        });

    app.route('/api/books/:id')
        .get(async (req, res) => {

            const bookId = req.params.id;

            const book = await Book.findById(bookId).exec();

            if (!book) return res.status(200).send('no book exists');

            const comments = await Comment.find({ bookId: bookId }).exec();

            const bookComments = comments.map(comment => comment.comment);

            return res.status(200).json({
                _id: book.id,
                title: book.title,
                commentcount: book.commentcount,
                comments: bookComments
            });

        })

        .post(async (req, res) => {

            let comment = req.body.comment;
            let bookId = req.params.id;

            if (!comment) return res.status(200).send('missing required field comment');

            const book = await Book.findById(bookId).exec();

            if (!book) return res.status(200).send('no book exists');

            const newComment = new Comment({
                bookId: book.id,
                comment: comment
            });

            // save new comment
            newComment.save()
                .then(comment => {

                    // update book
                    Book.findByIdAndUpdate(book.id, { $inc: { commentcount: 1 } }, { new: true })
                        .then(async book => {

                            const comments = await Comment.find({ bookId: book.id }).exec();

                            const bookComments = comments.map(comment => comment.comment);

                            return res.status(200).json({
                                _id: book.id,
                                title: book.title,
                                commentcount: book.commentcount,
                                comments: bookComments
                            });

                        })
                        .catch(err => {

                            console.log(err);

                            return res.status(200).json({
                                error: 'could not update book with new comment'
                            });

                        });

                })
                .catch(err => {

                    console.log(err);

                    return res.status(200).json({
                        error: 'could not save new comment'
                    });

                });

        })

        .delete((req, res) => {

            const bookId = req.params.id;

            Book.deleteOne({ _id: bookId })
                .then(bookDeleteResult => {

                    if (bookDeleteResult.deletedCount == 0) return res.status(200).send('no book exists');

                    console.log(`# of books delete: ${bookDeleteResult.deletedCount}`);

                    Comment.deleteMany({ bookId: bookId })
                        .then(commentDeleteResult => {

                            console.log(`# of comments delete: ${commentDeleteResult.deletedCount}`);

                            return res.status(200).send('delete successful');

                        })
                        .catch(err => {

                            return res.status(200).json({
                                error: 'comment delete unsuccessful'
                            });

                        });

                })
                .catch(err => {

                    console.log(err)

                    return res.status(200).json({
                        error: 'book delete unsuccessful'
                    });

                });

        });

};