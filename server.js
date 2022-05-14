'use strict';

require('dotenv').config();
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

appRoutes(app);
apiRoutes(app);
fccTestingRoutes(app);


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
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
});

module.exports = app;