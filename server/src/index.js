const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const httpLogger = require('./utils/http-logger');

const {HTTP_STATUS, DEFAULT_PORT} = require('./constants');

const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;
const PUBLIC_KEY = fs.readFileSync(path.resolve('./public.pem'), 'utf8');
const AUTH_PROVIDER_BASE_URL = 'https://www.wix.com/oauth';
const INSTANCE_API_URL = 'https://dev.wix.com/api/v1';
const BOOKINGS_API_URL = 'https://www.wixapis.com/bookings/v1';

const app = express();
const port = process.env.PORT || DEFAULT_PORT;
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
app.use(httpLogger());

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

async function getConstants(refreshToken) {
    const config = await getRequestConfig(refreshToken);
    const servicesResponse = (await axios.get('services', config)).data;
    const resourcesResponse = (await axios.get('resources', config)).data;
    const response = {
        services: servicesResponse.services,
        resources: resourcesResponse.resources
    };
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function getBookings(refreshToken, params) {
    const config = await getRequestConfig(refreshToken, params);
    const response = (await axios.get('bookings', config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function postCalendarListSlots(refreshToken, requestBody) {
    const config = await getRequestConfig(refreshToken, undefined);
    const response = (await axios.post('calendar/listSlots', requestBody, config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function postBookingMarkAsPaid(refreshToken, requestParams) {
    const config = await getRequestConfig(refreshToken, undefined);
    const response = (await axios.post(`bookings/${requestParams.id}/markAsPaid`, null, config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function postBookingReschedule(refreshToken, requestParams, requestBody) {
    const config = await getRequestConfig(refreshToken, undefined);
    const response = (await axios.post(`bookings/${requestParams.id}/reschedule`, requestBody, config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function postBookingConfirm(refreshToken, requestParams, requestBody) {
    const config = await getRequestConfig(refreshToken, undefined);
    const response = (await axios.post(`bookings/${requestParams.id}/confirm`, requestBody, config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function postBookingDecline(refreshToken, requestParams, requestBody) {
    const config = await getRequestConfig(refreshToken, undefined);
    const response = (await axios.post(`bookings/${requestParams.id}/decline`, requestBody, config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function postBookingSetAttendance(refreshToken, requestParams, requestBody) {
    const config = await getRequestConfig(refreshToken, undefined);
    const response = (await axios.post(`bookings/${requestParams.id}/setAttendance`, requestBody, config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
}

async function patchCalendarSession(refreshToken, requestParams, requestBody) {
    const config = await getRequestConfig(refreshToken, undefined);
    const response = (await axios.patch(`calendar/sessions/${requestParams.id}`, requestBody, config)).data;
    return {response, code: HTTP_STATUS.SUCCESS};
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
    const url = `${permissionRequestUrl}?token=${token}&appId=${appId}&redirectUrl=${redirectUrl}`

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

        const instance = await getAppInstance(refreshToken);
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

        res.status(HTTP_STATUS.SUCCESS).send('Hello Logged in user!')
    } catch (wixError) {
        console.log("Error getting token from Wix");
        console.log({wixError});
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
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

app.get('/constants', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await getConstants(refreshToken);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await getBookings(refreshToken, req.query);
        const bookings = out.response;
        res.status(HTTP_STATUS.SUCCESS).send(bookings);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.post('/calendar/listSlots', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postCalendarListSlots(refreshToken, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.post('/bookings/:id/markAsPaid', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingMarkAsPaid(refreshToken, req.params);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.post('/bookings/:id/reschedule', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingReschedule(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.post('/bookings/:id/confirm', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingConfirm(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.post('/bookings/:id/decline', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingDecline(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.post('/bookings/:id/setAttendance', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingSetAttendance(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

app.patch('/bookings/:id/replaceStaff', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const params = {id: req.body.sessionId};
        const payload = req.body.payload;
        const sessionResponse = await patchCalendarSession(refreshToken, params, payload);
        const query = {
            filter: {
                bookingId: req.params.id
            }
        };
        const bookingResponse = await getBookings(refreshToken, query);

        let booking;
        if (bookingResponse.response.bookingsEntries.length) {
            booking = bookingResponse.response.bookingsEntries[0].booking;
        }

        const response = {
            session: sessionResponse.response.session,
            booking
        };

        res.status(HTTP_STATUS.SUCCESS).send(response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});


app.listen(port, () => console.log(`My Wix Application ${APP_ID} is listening on port ${port}!`));