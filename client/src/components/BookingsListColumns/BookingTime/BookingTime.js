import React from 'react';
import {classes, st} from '../BookingsListColumns.st.css';
import {shorthandDateOnlyFormat, timeOnlyFormat} from '../../../utils';
import ColumnText from '../ColumnText/ColumnText';
import moment from 'moment-timezone';

const BookingTime = (props) => {
    const {data: {booking = {}}} = props;
    return (
        <div className={st(classes.columnDisplayContainer)}>
            <ColumnText size="small">{moment(booking.created).format(shorthandDateOnlyFormat)}</ColumnText>
            <ColumnText size="tiny">{moment(booking.created).format(timeOnlyFormat)}</ColumnText>
        </div>
    );
};

export default BookingTime;