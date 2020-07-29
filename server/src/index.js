const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;
const PUBLIC_KEY = fs.readFileSync(path.resolve('./public.pem'), 'utf8');
const AUTH_PROVIDER_BASE_URL = 'https://www.wix.com/oauth';
const INSTANCE_API_URL = 'https://dev.wix.com/api/v1';
const BOOKINGS_API_URL = 'https://www.wixapis.com/bookings/v1';

const app = express();
const port = process.env.PORT || 3000;
const incomingWebhooks = [];

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    },
    pool: {min: 0, max: 7}
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'statics')));
app.use(cors());

async function getRequestConfig(refreshToken, params) {
    const {access_token} = await getAccessToken(refreshToken);
    const options = {
        baseURL: BOOKINGS_API_URL,
        headers: {
            authorization: access_token,
        },
    };
    const config = {
        params
    };

    return {...options, ...config};
}

function getInstanceIdFromRequestHeaders(req) {
    return req.headers.instanceid;
}

async function getTokensFromWix(authCode) {
    const {data} = await axios.post(`${AUTH_PROVIDER_BASE_URL}/access`, {
        code: authCode,
        client_secret: APP_SECRET,
        client_id: APP_ID,
        grant_type: "authorization_code",
    });
    return data;
}

async function getAccessToken(refreshToken) {
    const {data} = await axios.post(`${AUTH_PROVIDER_BASE_URL}/access`, {
        refresh_token: refreshToken,
        client_secret: APP_SECRET,
        client_id: APP_ID,
        grant_type: "refresh_token",
    });
    return data;
}

function getRefreshToken(instanceId) {
    return knex('appInstances').where({
        'instanceId': instanceId
    }).first('refreshToken').then((row) => {
        return row.refreshToken
    })
}

async function getAppInstance(refreshToken) {
    try {
        console.log('getAppInstance with refreshToken = ' + refreshToken);
        console.log("==============================");
        const {access_token} = await getAccessToken(refreshToken);
        console.log('accessToken = ' + access_token);

        const body = {
            // *** PUT YOUR PARAMS HERE ***
            //query: {limit: 10},
        };
        const options = {
            headers: {
                authorization: access_token,
            },
        };
        const appInstance = axios.create({
            baseURL: INSTANCE_API_URL,
            headers: {authorization: access_token}
        });
        const instance = (await appInstance.get('instance', body)).data;

        return instance;
    } catch (e) {
        console.log('error in getAppInstance', {e});
        return;
    }
}

async function getBookings(refreshToken, params) {
    try {
        const config = await getRequestConfig(refreshToken, params);
        const response = (await axios.get('bookings', config)).data;
        return {response, code: 200};
    } catch (e) {
        console.log({e});
        return {code: e.response.status};
    }
}

app.get('/signup', (req, res) => {
    // This route  is called before the user is asked to provide consent
    // Configure the `App URL` in  Wix Developers to point here
    // *** PUT YOUR SIGNUP CODE HERE *** ///
    console.log("got a call from Wix for signup");
    console.log("==============================");

    const permissionRequestUrl = 'https://www.wix.com/app-oauth-installation/consent';
    const appId = APP_ID;
    const redirectUrl = `https://${req.get('host')}/login`;
    const token = req.query.token;
    var url = `${permissionRequestUrl}?token=${token}&appId=${appId}&redirectUrl=${redirectUrl}`

    console.log("redirecting to " + url);
    console.log("=============================");
    res.redirect(url);
});

app.get('/login', async (req, res) => {
    // This route  is called once the user finished installing your application and Wix redirects them to your application's site (here).
    // Configure the `Redirect URL` in the Wix Developers to point here
    // *** PUT YOUR LOGIN CODE HERE *** ///
    console.log("got a call from Wix for login");
    console.log("=============================");

    const authorizationCode = req.query.code;

    console.log("authorizationCode = " + authorizationCode);

    let refreshToken, accessToken;
    try {
//    console.log("getting Tokens From Wix ");
//    console.log("=======================");
        const data = await getTokensFromWix(authorizationCode);

        refreshToken = data.refresh_token;
        accessToken = data.access_token;

//    console.log("refreshToken = " + refreshToken);
//    console.log("accessToken = " + accessToken);
//    console.log("=============================");

        instance = await getAppInstance(refreshToken);
        // TODO: Check if refreshToken is already exists in the DB for this instanceId
        knex('appInstances').insert({
            'instanceId': instance.instance.instanceId,
            'refreshToken': refreshToken
        }).catch(e => {
            console.error(e);
        });

        axios.post('https://www.wix.com/_api/site-apps/v1/site-apps/token-received', {}, {
            headers: {
                'authorization': accessToken
            }
        });

        // need to post https://www.wix.com/app-oauth-installation/token-received to notif wix that we finished getting the token

        res.status(200).send('Hello Logged in user!')
    } catch (wixError) {
        console.log("Error getting token from Wix");
        console.log({wixError});
        res.status(500);
        return;
    }
});

app.post('/webhook-callback', (req, res) => {
    console.log('got webhook event from Wix!', req.body);
    console.log("===========================");
    const data = jwt.verify(req.body, PUBLIC_KEY, {algorithms: ['RS256']});
    const parsedData = JSON.parse(data.data);
    const prettyData = {...data, data: {...parsedData, data: JSON.parse(parsedData.data)}};
    console.log('webhook event data after verification:', prettyData);
    incomingWebhooks.push({body: prettyData, headers: req.headers});
    res.send(req.body);
});

app.get('/webhooks', async (req, res) => {
    res.render('webhooks', {
        title: 'Wix Application',
        app_id: APP_ID,
        webhooks: JSON.stringify(incomingWebhooks, null, 2)
    });
});

app.get('/bookings', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await getBookings(refreshToken, req.query);
        const bookings = out.response;
        res.status(200).send(bookings);
    } catch (e) {
        console.log({e});
        res.status(500);
        return;
    }
});

app.listen(port, () => console.log(`My Wix Application ${APP_ID} is listening on port ${port}!`));