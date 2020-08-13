const express = require('express');
const router = express.Router();
const {HTTP_STATUS} = require('./constants');
const {getInstanceIdFromRequestHeaders, getRefreshToken} = require('./utils/authentication-utils');
const {getConstants, getBookings, postCalendarListSlots, postBookingMarkAsPaid, postBookingReschedule, postBookingConfirm, postBookingDecline, postBookingSetAttendance, patchCalendarSession} = require('./utils/api-utils');

router.get('/constants', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await getConstants(refreshToken);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.get('/bookings', async (req, res) => {
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

router.post('/calendar/listSlots', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postCalendarListSlots(refreshToken, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.post('/bookings/:id/markAsPaid', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingMarkAsPaid(refreshToken, req.params);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.post('/bookings/:id/reschedule', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingReschedule(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.post('/bookings/:id/confirm', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingConfirm(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.post('/bookings/:id/decline', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingDecline(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.post('/bookings/:id/setAttendance', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const out = await postBookingSetAttendance(refreshToken, req.params, req.body);
        res.status(HTTP_STATUS.SUCCESS).send(out.response);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.patch('/bookings/:id/replaceStaff', async (req, res) => {
    try {
        const instanceId = getInstanceIdFromRequestHeaders(req);
        const refreshToken = await getRefreshToken(instanceId);
        const params = {id: req.body.sessionId};
        const payload = req.body.payload;
        const sessionResponse = await patchCalendarSession(refreshToken, params, payload);

        const queryParams = {'query.filter.stringValue': {bookingId: req.params.id}};
        const bookingResponse = await getBookings(refreshToken, queryParams);

        let booking;
        if (bookingResponse.response.bookingsEntries.length === 1) {
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

module.exports = router;