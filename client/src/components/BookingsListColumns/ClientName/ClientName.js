import React from 'react';
import {classes, st} from '../BookingsListColumns.st.css';
import ColumnText from '../ColumnText/ColumnText';

const ClientName = (props) => {
    const {data: {booking}} = props;
    const {formInfo = {}} = booking;
    const {contactDetails = {}, paymentSelection = []} = formInfo;

    const numberOfParticipants = paymentSelection.length ? paymentSelection[0].numberOfParticipants : 1;

    return (
        <div className={st(classes.columnDisplayContainer)}>
            <ColumnText>{contactDetails.firstName} {contactDetails.lastName}</ColumnText>
            {numberOfParticipants > 1 ? <ColumnText size="tiny">+ {numberOfParticipants - 1} Guests</ColumnText> : null}
        </div>
    );
};

export default ClientName;