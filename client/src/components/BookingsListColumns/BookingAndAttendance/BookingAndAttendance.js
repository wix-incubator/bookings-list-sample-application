import React from 'react';
import {BadgeDropdown} from '../../BadgeDropdown/BadgeDropdown';
import NotAvailable from '../NotAvailable/NotAvailable';

const BOOKING_AND_ATTENDANCE_MAP = {};

const BookingAndAttendance = (props) => {
    const {data: {booking}} = props;
    return <NotAvailable/>;
    // TODO: implement real options
    const options = [
        {
            id: '0',
            skin: 'general',
            text: 'general'
        },
        {
            id: '1',
            skin: 'standard',
            text: 'standard'
        },
        {
            id: '2',
            skin: 'danger',
            text: 'danger'
        },
        {
            id: '3',
            skin: 'success',
            text: 'success'
        },
        {
            id: '4',
            skin: 'neutral',
            text: 'neutral'
        },
        {
            id: '5',
            skin: 'neutralLight',
            text: 'neutralLight'
        },
        {
            id: '6',
            skin: 'warning',
            text: 'warning'
        },
        {
            id: '7',
            skin: 'warningLight',
            text: 'warningLight'
        },
        {
            id: '8',
            skin: 'urgent',
            text: 'urgent'
        },
        {
            id: '9',
            skin: 'neutralStandard',
            text: 'neutralStandard'
        },
        {
            id: '10',
            skin: 'neutralSuccess',
            text: 'neutralSuccess'
        },
        {
            id: '11',
            skin: 'neutralDanger',
            text: 'neutralDanger'
        },
        {
            id: '12',
            skin: 'premium',
            text: 'premium'
        }
    ];

    return (
        <BadgeDropdown
            skin="general"
            selectedId={booking.selectedBookingId}
            disabled={false}
            type="outlined"
            onSelect={(option) => booking.selectedBookingId = option.id}
            options={options}
        />
    );
};

export default BookingAndAttendance;