/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('#example Test GET /api/books', (done) => {
        chai.request(server)
            .get('/api/books')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'response should be an array');
                assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
                assert.property(res.body[0], 'title', 'Books in array should contain title');
                assert.property(res.body[0], '_id', 'Books in array should contain _id');
                done();
            });
    });

    suite('Routing tests', ()=> {


        suite('POST /api/books with title => create book object/expect book object', function () {

            test('Test POST /api/books with title', (done) => {
                
                chai.request(server)
                .post('/api/books')
                .set('content-type', 'application/x-www-urlencoded')
                .type('form')
                .send(`title=test${new Date().toISOString()}`)
                .end((err, res) => {

                    if (err) console.log(err);

                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.property(res.body, 'title');
                    assert.property(res.body, '_id');
                    
                    done();

                });

            });

            test('Test POST /api/books with no title given', (done) => {
                
                chai.request(server)
                .post('/api/books')
                .set('content-type', 'application/x-www-urlencoded')
                .type('form')
                .send()
                .end((err, res) => {

                    if (err) console.log(err);

                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'text/html');
                    assert.equal(res.text, 'missing required field title');
                    
                    done();

                });

            });

        });


        suite('GET /api/books => array of books', () => {

            test('Test GET /api/books', function (done) {
                
                chai.request(server)
                .get('/api/books')
                .end((err, res) => {

                    if (err) console.log(err);

                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.isArray(res.body);

                    const books = res.body;

                    books.forEach(book => {

                        assert.property(book, '_id');
                        assert.property(book, 'title');
                        assert.property(book, 'comments');

                    });

                    done();

                });

            });

        });


        suite('GET /api/books/[id] => book object with [id]', () => {

            test('Test GET /api/books/[id] with id not in db', (done) => {
                //done();
            });

            test('Test GET /api/books/[id] with valid id in db', (done) => {
                //done();
            });

        });


        suite('POST /api/books/[id] => add comment/expect book object with id', () => {

            test('Test POST /api/books/[id] with comment', (done) => {
                //done();
            });

            test('Test POST /api/books/[id] without comment field', (done) => {
                //done();
            });

            test('Test POST /api/books/[id] with comment, id not in db', (done) => {
                //done();
            });

        });

        suite('DELETE /api/books/[id] => delete book object id', () => {

            test('Test DELETE /api/books/[id] with valid id in db', (done) => {
                //done();
            });

            test('Test DELETE /api/books/[id] with id not in db', (done) => {
                //done();
            });

        });

    });

});