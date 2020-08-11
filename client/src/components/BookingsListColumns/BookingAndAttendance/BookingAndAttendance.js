import React from 'react';
import {BadgeDropdown} from '../../BadgeDropdown/BadgeDropdown';
import {translate} from '../../../utils';
import {observer} from 'mobx-react';
import {Loader} from 'wix-style-react';
import NotAvailable from '../NotAvailable/NotAvailable';


const ATTENDANCE_STATUS_MAP = {
    undefined: 'BOOKED',
    true: 'CHECKED_IN',
    false: 'NO_SHOW'
};

const getBookingAndAttendanceOptions = () => [
    {id: 'BOOKED', skin: 'general', text: translate('BookingAndAttendanceDropdown.booked')},
    {id: 'PENDING', skin: 'premium', text: translate('BookingAndAttendanceDropdown.pending')},
    {id: 'PENDING_APPROVAL', skin: 'premium', text: translate('BookingAndAttendanceDropdown.pending')},
    {id: 'PENDING_CHECKOUT', skin: 'premium', text: translate('BookingAndAttendanceDropdown.pending')},
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
    PENDING_APPROVAL: () => getBookingAndAttendanceOptions().filter(option => ['PENDING_APPROVAL', 'CONFIRM', 'DECLINE'].includes(option.id)),
    PENDING_CHECKOUT: () => getBookingAndAttendanceOptions().filter(option => ['PENDING_CHECKOUT', 'CONFIRM', 'DECLINE'].includes(option.id)),
    CANCELED: () => getBookingAndAttendanceOptions().filter(option => ['CANCELED'].includes(option.id)),
    DECLINED: () => getBookingAndAttendanceOptions().filter(option => ['DECLINED'].includes(option.id)),
    BOOKED: () => getBookingAndAttendanceOptions().filter(option => ['BOOKED', 'CHECKED_IN', 'NO_SHOW'].includes(option.id)),
    CHECKED_IN: () => getBookingAndAttendanceOptions().filter(option => ['CHECKED_IN', 'NO_SHOW'].includes(option.id)),
    NO_SHOW: () => getBookingAndAttendanceOptions().filter(option => ['CHECKED_IN', 'NO_SHOW'].includes(option.id))
};

const BookingAndAttendance = observer((props) => {
    const {onBookingAndAttendanceStatusSelect, data: {booking}} = props;
    const {loading} = booking;
    let bookingStatusId = booking.status;
    let attendanceStatus = booking.attendanceInfo && booking.attendanceInfo.attendanceStatus;
    let attendanceStatusId = ATTENDANCE_STATUS_MAP[attendanceStatus];

    const status = bookingStatusId === 'CONFIRMED' ? attendanceStatusId : bookingStatusId;
    const disabled = ['CANCELED', 'DECLINED'].includes(bookingStatusId) || loading;

    const bookingAndAttendanceOptions = BOOKING_AND_ATTENDANCE_MAP[status] ? BOOKING_AND_ATTENDANCE_MAP[status]() : null;

    if (!bookingAndAttendanceOptions) {
        return <NotAvailable/>;
    }

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <BadgeDropdown
                skin="general"
                selectedId={status}
                disabled={disabled}
                type="outlined"
                onSelect={onBookingAndAttendanceStatusSelect}
                options={bookingAndAttendanceOptions}
            />
            {
                loading ?
                    <div style={{margin: '0 5px'}}>
                        <Loader size="tiny"/>
                    </div>
                    :
                    null
            }
        </div>
    );
});

export default BookingAndAttendance;