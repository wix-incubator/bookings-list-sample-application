import React from 'react';
import {BadgeDropdown} from '../../BadgeDropdown/BadgeDropdown';
import {translate} from '../../../utils';
import {observer} from 'mobx-react';


const ATTENDANCE_STATUS_MAP = {
    undefined: 'BOOKED',
    true: 'CHECKED_IN',
    false: 'NO_SHOW'
};

const getBookingAndAttendanceOptions = () => [
    {id: 'BOOKED', skin: 'general', text: translate('BookingAndAttendanceDropdown.booked')},
    {id: 'PENDING', skin: 'premium', text: translate('BookingAndAttendanceDropdown.pending')},
    {id: 'PENDING_APPROVAL', skin: 'premium', text: translate('BookingAndAttendanceDropdown.pendingApproval')},
    {id: 'PENDING_CHECKOUT', skin: 'premium', text: translate('BookingAndAttendanceDropdown.pendingCheckout')},
    {id: 'CHECKED_IN', skin: 'success', text: translate('BookingAndAttendanceDropdown.checkedIn')},
    {id: 'NO_SHOW', skin: 'danger', text: translate('BookingAndAttendanceDropdown.noShow')},
    {id: 'CONFIRM', skin: 'general', text: translate('BookingAndAttendanceDropdown.confirm')},
    {id: 'DECLINE', skin: 'danger', text: translate('BookingAndAttendanceDropdown.decline')},
    {id: 'DECLINED', skin: 'danger', text: translate('BookingAndAttendanceDropdown.declined')},
    {id: 'CANCELED', skin: 'danger', text: translate('BookingAndAttendanceDropdown.cancelled')}
];

const BOOKING_AND_ATTENDANCE_MAP = {
    PENDING: () => getBookingAndAttendanceOptions().filter(option => ['PENDING', 'CONFIRM', 'DECLINE'].includes(option.id)),
    CONFIRMED: () => getBookingAndAttendanceOptions().filter(option => ['BOOKED', 'CHECKED_IN', 'NO_SHOW'].includes(option.id)),
    PENDING_APPROVAL: () => getBookingAndAttendanceOptions().filter(option => ['PENDING', 'CONFIRM', 'DECLINE'].includes(option.id)),
    PENDING_CHECKOUT: () => getBookingAndAttendanceOptions().filter(option => ['PENDING', 'CONFIRM', 'DECLINE'].includes(option.id)),
    CANCELED: () => getBookingAndAttendanceOptions().filter(option => ['CANCELED'].includes(option.id)),
    DECLINED: () => getBookingAndAttendanceOptions().filter(option => ['DECLINED'].includes(option.id))
};

const BookingAndAttendance = observer((props) => {
    const {onBookingAndAttendanceStatusSelect, data: {booking}} = props;
    let bookingStatusId = booking.status;
    let attendanceStatus = booking.attendanceInfo && booking.attendanceInfo.attendanceStatus;
    let attendanceStatusId = ATTENDANCE_STATUS_MAP[attendanceStatus];

    const status = bookingStatusId === 'CONFIRMED' ? attendanceStatusId : bookingStatusId;
    const disabled = ['CANCELED', 'DECLINED'].includes(bookingStatusId);

    const bookingAndAttendanceOptions = BOOKING_AND_ATTENDANCE_MAP[bookingStatusId] ? BOOKING_AND_ATTENDANCE_MAP[bookingStatusId]() : [];

    return (
        <BadgeDropdown
            skin="general"
            selectedId={status}
            disabled={disabled}
            type="outlined"
            onSelect={onBookingAndAttendanceStatusSelect}
            options={bookingAndAttendanceOptions}
        />
    );
});

export default BookingAndAttendance;