const Nylas = require('nylas');
const express = require('express');
const router = express.Router();
const {getInstanceIdFromRequestHeaders, getRefreshToken} = require('./utils/authentication-utils');
const {getBookings} = require('./utils/api-utils');
const axios = require('axios');

Nylas.config({
    clientId: 'dobey21wzxs80x955av1tsd6',
    clientSecret: '4uk1m5tlaitx3qc5e5qh8rtw3',
});

router.post('/sync-event', async (req, res) => {
        // if (req.session.nylas_info) {

        // /**
        //  * getting sessions from wix and doing initial sync
        //  */
        //
        // try {
        //     const instanceId = getInstanceIdFromRequestHeaders(req);
        //     const refreshToken = await getRefreshToken(instanceId);
        //     const out = await getBookings(refreshToken, {
        //             withBookingAllowedActions: 'true',
        //             'query.filter.stringValue': '{"startTime":{"$gte":"2021-02-16T21:00:00.000Z"}}',
        //         }
        //     );
        //     const bookings = out.response;
        //
        //     const nylas = Nylas.with(req.session.nylas_info.access_token);
        //
        //     bookings.bookingsEntries.map((bookingDetails) => {
        //         let event = nylas.events.build();
        //         event.title = `${bookingDetails.booking.bookedEntity.title} for ${bookingDetails.booking.formInfo.contactDetails.firstName} ${bookingDetails.booking.formInfo.contactDetails.phone}`;
        //         event.when = {
        //             "start_time": bookingDetails.booking.bookedEntity.singleSession.start,
        //             "end_time": bookingDetails.booking.bookedEntity.singleSession.end,
        //             "start_timezone": bookingDetails.booking.formInfo.contactDetails.timeZone,
        //             "end_timezone": bookingDetails.booking.formInfo.contactDetails.timeZone,
        //         };
        //         if (bookingDetails.booking.bookedEntity.location.locationType !== "OWNER_BUSINESS") {
        //             event.location = bookingDetails.booking.bookedEntity.location.locationType;
        //         }
        //         // TODO: multi line should work like this with template literals but it doesn't appear that way in the external cal
        //         event.description = `Staff Member: ${bookingDetails.booking.bookedResources[0].name}
        //         Client's phone number: ${bookingDetails.booking.formInfo.contactDetails.phone}
        //         Client's email: ${bookingDetails.booking.formInfo.contactDetails.email}
        //         Note to self: Wix`;
        //         event.busy = true;
        //         event.calendarId = '919pt9kyr8ai9tb01dcno0ic0';  // for icloud 919pt9kyr8ai9tb01dcno0ic0 for outlook
        //
        //         event.save({notify_participants: true});
        //     });
        //
        //     res.status(200).send(bookings.bookingsEntries);
        // } catch (e) {
        //     console.log(e);
        //     res.status(e.response.status).send(e.response.data);
        // }

        // } else {
        //     console.log("User not connected");
        //     req.session.triedToSync = true;
        //     res.status(401).json({success: false, message: "User not connected"});
        // }
        //   create a new webhook
        try {
            const newWebhook = await Nylas.webhooks.build({
                callbackUrl: 'https://nylas-webhook.ngrok.io/api/webhook',
                state: 'active',
                triggers: ['event.created', 'event.updated', 'event.deleted', 'account.connected', 'account.invalid', 'account.running', 'account.stopped', 'account.sync_error'],
            });
            newWebhook.save().then(webhook => console.log(webhook.id)).catch((e) => console.error(e));
            res.status(200).send('success in creating a webhook');
        } catch (err) {
            console.error(err);
        }
    }
);


module.exports = router;
