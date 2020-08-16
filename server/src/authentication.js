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

const PUBLIC_KEY = fs.readFileSync(path.resolve('./public.pem'), 'utf8');
const incomingWebhooks = [];

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