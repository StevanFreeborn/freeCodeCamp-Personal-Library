'use strict';

require('dotenv').config();
require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const appRoutes = require('./routes/app')
const apiRoutes = require('./routes/api');
const fccTestingRoutes = require('./routes/fcctesting');
const runner = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {

    console.log('Mongoose connected successfully');

    apiRoutes(app);
    fccTestingRoutes(app);
    appRoutes(app);

    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(() => {
            try {
                runner.run();
            } catch (e) {
                console.log('Tests are not valid:');
                console.error(e);
            }
        }, 3500);
    }
})
    .catch(err => {

        console.log(err);

        app.use(function (req, res, next) {
            res.sendFile(process.cwd() + '/views/error.html');
        });

    });

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;