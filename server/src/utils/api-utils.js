const axios = require('axios');
const {HTTP_STATUS} = require('../constants');
const {getSiteProperties, getRequestConfig, getInstanceIdFromRequestHeaders, getTokensFromWix, getAccessToken, getRefreshToken, getAppInstance} = require('./authentication-utils');

async function getConstants(refreshToken) {
    const config = await getRequestConfig(refreshToken);
    const servicesResponse = (await axios.get('services', config)).data;
    const resourcesResponse = (await axios.get('resources', config)).data;
    const siteProperties = await getSiteProperties(refreshToken);

    const response = {
        services: servicesResponse.services,
        resources: resourcesResponse.resources,
        siteProperties: siteProperties.properties
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

module.exports = {
    getConstants,
    getBookings,
    postCalendarListSlots,
    postBookingMarkAsPaid,
    postBookingReschedule,
    postBookingConfirm,
    postBookingDecline,
    postBookingSetAttendance,
    patchCalendarSession
};