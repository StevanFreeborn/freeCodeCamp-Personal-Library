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

                book.comments = bookComments;

                return book;

            });

            return res.status(200).json(booksWithComments);

        })

        .post(async (req, res) => {
            
            const title = req.body.title;

            if (!title) return res.status(200).send('missing required field title');

            const newBook = new Book({
                title: title
            });

            newBook.save()
            .then( book => {

                return res.status(200).json(book);

            })
            .catch( err => {

                console.log(err);
                
                return res.status(200).json({
                    error: 'could not save new book'
                });

            });

        })

        .delete((req, res) => {
            //if successful response will be 'complete delete successful'
        });

    app.route('/api/books/:id')
        .get((req, res) => {
            let bookid = req.params.id;
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
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
            .then( comment => {

                // update books
                Book.findByIdAndUpdate(book.id, {$inc: {commentcount: 1}}, {new: true})
                .then( async book => {

                    const comments = await Comment.find({bookId: book.id}).exec();
                    
                    book.comments = comments.map(comment => comment.comment);

                    return res.status(200).json(book);

                })
                .catch( err => {

                    console.log(err);
                
                    return res.status(200).json({
                        error: 'could not update book with new comment'
                    });

                });

            })
            .catch( err => {

                console.log(err);
                
                return res.status(200).json({
                    error: 'could not save new comment'
                });

            });

        })

        .delete((req, res) => {
            let bookid = req.params.id;
            //if successful response will be 'delete successful'
        });

};