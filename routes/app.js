module.exports = function (app) {

    app.route('/').get((req, res) => {
        res.sendFile(process.cwd() + '/views/index.html');
    });

    app.use((req, res, next) => {
        res.status(404)
            .type('text')
            .send('Not Found');
    });

};