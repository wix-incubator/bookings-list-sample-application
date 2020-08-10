import React from 'react';
import {formatDate} from 'wix-style-react/src/LocaleUtils';
import {observer} from 'mobx-react';
import {dayHourFormat, getTimeDifference} from '../../../utils';
import {classes, st} from '../BookingsListColumns.st.css';
import NotAvailable from '../NotAvailable/NotAvailable';
import DateAndTimeSmall from 'wix-ui-icons-common/DateAndTimeSmall';
import ColumnText from '../ColumnText/ColumnText';

const ServiceAndSession = observer((props) => {
    const {services, onCalendarClick, data: {allowedActions, booking, focused}} = props;

    const {bookedEntity = {}} = booking;
    const service = services[bookedEntity.serviceId];
    if (!service) {
        return <NotAvailable/>;
    }

    const {singleSession, setOfSessions} = bookedEntity;

    // TODO: add indication for singleSession | setOfSessions
    const sessionInfo = singleSession ?
        `${formatDate(new Date(singleSession.start), dayHourFormat)} - ${getTimeDifference(singleSession.start, singleSession.end)}h`
        :
        `${formatDate(new Date(setOfSessions.firstSessionStart), dayHourFormat)}`;

    return (
        <div className={st(classes.rowDisplayContainer)}>
            <div className={st(classes.columnDisplayContainer)}>
                <ColumnText>{service.info.name}</ColumnText>
                <ColumnText size="tiny">
                    {sessionInfo}
                </ColumnText>
            </div>
            {focused && allowedActions && allowedActions.reschedule ? <DateAndTimeSmall className={st(classes.serviceAndSessionRescheduleIcon)} onClick={() => onCalendarClick(booking)}/> : null}
        </div>

    );
});

export default ServiceAndSession;