const axios = require('axios');
const knex = require('../db');
const {APP_ID, APP_SECRET} = require('../config');

const AUTH_PROVIDER_BASE_URL = 'https://www.wix.com/oauth';
const INSTANCE_API_URL = 'https://dev.wix.com/api/v1';
const BOOKINGS_API_URL = 'https://www.wixapis.com/bookings/v1';

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

module.exports = {
    getRequestConfig,
    getInstanceIdFromRequestHeaders,
    getTokensFromWix,
    getAccessToken,
    getRefreshToken,
    getAppInstance
};