import React from 'react';
import {observer} from 'mobx-react';
import {dayHourFormat, getTimeDifference, isBookingOneOnOne} from '../../../utils';
import {classes, st} from '../BookingsListColumns.st.css';
import NotAvailable from '../NotAvailable/NotAvailable';
import DateAndTimeSmall from 'wix-ui-icons-common/DateAndTimeSmall';
import ColumnText from '../ColumnText/ColumnText';
import moment from 'moment-timezone';

const ServiceAndSession = observer((props) => {
    const {services, onCalendarClick, data: {booking, focused}} = props;

    const {bookedEntity = {}} = booking;
    const service = services[bookedEntity.serviceId];
    if (!service) {
        return <NotAvailable/>;
    }

    const {singleSession, setOfSessions} = bookedEntity;

    const sessionInfo = singleSession ?
        `${moment(singleSession.start).format(dayHourFormat)} - ${getTimeDifference(singleSession.start, singleSession.end)}h`
        :
        `${moment(setOfSessions.firstSessionStart).format(dayHourFormat)}`;

    return (
        <div className={st(classes.rowDisplayContainer)}>
            <div className={st(classes.columnDisplayContainer)}>
                <ColumnText>{service.info.name}</ColumnText>
                <ColumnText size="tiny" isRTL={true}>
                    {sessionInfo}
                </ColumnText>
            </div>
            {focused && isBookingOneOnOne(booking) ? <DateAndTimeSmall className={st(classes.serviceAndSessionRescheduleIcon)} onClick={() => onCalendarClick(booking)}/> : null}
        </div>

    );
});

export default ServiceAndSession;