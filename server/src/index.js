const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cors = require('cors');
const httpLogger = require('./utils/http-logger');
const api = require('./api');
const authentication_api = require('./authentication');

const {DEFAULT_PORT} = require('./constants');
const {APP_ID, PORT} = require('./config');

const app = express();
const port = PORT || DEFAULT_PORT;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'statics')));
app.use(cors());
app.use(httpLogger());
app.use('/api', api);
app.use('/api', authentication_api);

app.listen(port, () => console.log(`My Wix Application ${APP_ID} is listening on port ${port}!`));
