// authentication EPs
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const knex = require('./db');
const {HTTP_STATUS} = require('./constants');
const {APP_ID} = require('./config');
const {getTokensFromWix, getAppInstance} = require('./utils/authentication-utils');
const express = require('express');
const router = express.Router();
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");
const Nylas = require('nylas');

const PUBLIC_KEY = fs.readFileSync(path.resolve('./public.pem'), 'utf8');
const incomingWebhooks = [];

const code_verifier = randomstring.generate(128);

router.post('/icloud-nylas-auth', async (req, res) => {
    try {
        const result = await axios.post('https://api.nylas.com/connect/authorize', {
            "client_id": "dobey21wzxs80x955av1tsd6",
            "name": "Michal Menachem",
            "email_address": "michalmenachem@icloud.com",
            "provider": "icloud",
            "settings": {
                "username": "michalmenachem@icloud.com",
                "password": "bskj-zurs-qrrg-vbsf"
            },
            "scopes": "email,calendar,contacts"
        });

        const token_result = await axios.post('https://api.nylas.com/connect/token', {
            "client_id": "dobey21wzxs80x955av1tsd6",
            "client_secret": "4uk1m5tlaitx3qc5e5qh8rtw3",
            "code": result.data.code
        })
        req.session.nylas_info = token_result.data;
        res.status(200).json({success: true, message: "Connected successfully with iCloud!"});
    } catch (err) {
        console.error(err);
        res.status(401).json({success: false, message: "Connection to iCloud failed"});
    }
});

router.get('/microsoft-auth', (req, res) => {

    const base64Digest = crypto
        .createHash('sha256')
        .update(code_verifier)
        .digest('base64');

    const code_challenge = base64url.fromBase64(base64Digest);
    res.status(HTTP_STATUS.SUCCESS).send('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?' +
        'client_id=cf814374-8298-4940-9378-de1c2d817bd1' +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent('http://localhost:5000/api/microsoft-token/') +
        '&response_mode=query' +
        '&scope=' + encodeURIComponent('https://graph.microsoft.com/Calendars.Read') +
        '&state=12345' +
        '&code_challenge=' + code_challenge +
        '&code_challenge_method=S256'
    );
});

router.get('/microsoft-token', async (req, res) => {
        const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
        const params = new URLSearchParams();

        params.append('grant_type', 'authorization_code');
        params.append('client_id', 'cf814374-8298-4940-9378-de1c2d817bd1');
        params.append('scope', 'https://graph.microsoft.com/Calendars.Read');
        params.append('redirect_uri', 'http://localhost:5000/api/microsoft-token/');
        params.append('code', req.query.code);
        params.append('code_verifier', code_verifier);

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'http://localhost:5000',
                'Access-Control-Allow-Origin': '*'
            }
        };
        try {
            const result = await axios.post(url, params, config);
            req.session.access_token = result.data.access_token;
            req.session.refresh_token = result.data.refresh_token;
            console.log("access token: " + req.session.access_token);
            console.log("refresh token: " + req.session.refresh_token);

            const payload = {
                "client_id": "dobey21wzxs80x955av1tsd6",
                "name": "Michal Menachem",
                "email_address": "michalmenachem@outlook.co.il",
                "provider": "office365",
                "settings": {
                    "microsoft_client_id": "cf814374-8298-4940-9378-de1c2d817bd1",
                    "microsoft_client_secret": encodeURIComponent("wKLI2Q.8sg5-U9COx~W1Bd004Zwhy2c-gA"),
                    "microsoft_refresh_token": encodeURIComponent(req.session.refresh_token),
                    "redirect_uri": encodeURIComponent("http://localhost:5000/api/microsoft-token/"),
                },
                "scopes": 'calendar.read_only'
            };

            console.log(payload);
            const nylasAuthResult = await axios.post("https://api.nylas.com/connect/authorize", payload);
            console.log((nylasAuthResult.data));
            res.redirect('/');
        } catch
            (err) {
            console.error(err);
        }
    }
);

router.get('/signup', (req, res) => {
    // This route  is called before the user is asked to provide consent
    // Configure the `App URL` in  Wix Developers to point here
    // *** PUT YOUR SIGNUP CODE HERE *** ///
    console.log("got a call from Wix for signup");
    console.log("==============================");

    const permissionRequestUrl = 'https://www.wix.com/app-oauth-installation/consent';
    const appId = APP_ID;
    const redirectUrl = `${process.env.APP_BASE_URL}/api/login`;
    const token = req.query.token;
    const url = `${permissionRequestUrl}?token=${token}&appId=${appId}&redirectUrl=${redirectUrl}`

    console.log("redirecting to " + url);
    console.log("=============================");
    res.redirect(url);
});

router.get('/login', async (req, res) => {
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
        const url = `https://www.wix.com/_api/site-apps/v1/site-apps/token-received?${accessToken}`
        res.redirect(url);

    } catch (wixError) {
        console.log("Error getting token from Wix");
        console.log({wixError});
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        return;
    }
});

router.post('/webhook-callback', (req, res) => {
    console.log('got webhook event from Wix!', req.body);
    console.log("===========================");
    const data = jwt.verify(req.body, PUBLIC_KEY, {algorithms: ['RS256']});
    const parsedData = JSON.parse(data.data);
    const prettyData = {...data, data: {...parsedData, data: JSON.parse(parsedData.data)}};
    console.log('webhook event data after verification:', prettyData);
    incomingWebhooks.push({body: prettyData, headers: req.headers});
    res.send(req.body);
});

router.get('/webhooks', async (req, res) => {
    res.render('webhooks', {
        title: 'Wix Application',
        app_id: APP_ID,
        webhooks: JSON.stringify(incomingWebhooks, null, 2)
    });
});

module.exports = router;
