import React from 'react';
import {formatDate} from 'wix-style-react/src/LocaleUtils';
import {classes, st} from '../BookingsListColumns.st.css';
import {dateOnlyFormat, timeOnlyFormat} from '../../../utils';
import ColumnText from '../ColumnText/ColumnText';

const BookingTime = (props) => {
    const {data: {booking = {}}} = props;
    return (
        <div className={st(classes.columnDisplayContainer)}>
            <ColumnText size="small">{formatDate(new Date(booking.created), dateOnlyFormat)}</ColumnText>
            <ColumnText size="tiny">{formatDate(new Date(booking.created), timeOnlyFormat)}</ColumnText>
        </div>
    );
};

export default BookingTime;