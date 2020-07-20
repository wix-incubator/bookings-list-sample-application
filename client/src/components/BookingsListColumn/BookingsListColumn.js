import React, {useCallback, useState} from 'react';
import {Text, Tooltip} from 'wix-style-react';
import {formatDate} from 'wix-style-react/src/LocaleUtils';
import {st, classes} from './BookingsListColumns.st.css';
import {getTimeDifference} from '../../utils';
import {observer} from 'mobx-react';
import getSymbolFromCurrency from 'currency-symbol-map';
import StatusAlert from 'wix-ui-icons-common/StatusAlert';
import LanguagesSmall from 'wix-ui-icons-common/LanguagesSmall';
import MobileSmall from 'wix-ui-icons-common/MobileSmall';

const ColumnText = (props) => {
    return (
        <Text style={{color: '#32536a'}} {...props}/>
    );
};

const PAYMENT_MAP = {
    UNDEFINED: {name: ''},
    COMPLETE: {name: 'Paid'},
    PENDING_CASHIER: {name: 'Pending Cashier'},
    REJECTED: {name: 'Rejected'},
    READY: {name: 'Ready'},
    CANCELED: {name: 'Cancelled'},
    REFUNDED: {name: 'Refunded'},
    PENDING_MERCHANT: {name: 'Pending Merchant'},
    WIX_PAY_FAILURE: {name: 'Wix Pay Failure'},
    PENDING_MARK_AS_PAID: {name: 'Due'},
    PENDING_BUYER: {name: 'Due'}
};

export default class BookingsListColumn extends React.Component {
    static BookingTime = ({data: {booking}}) => {
        return (
            <div className={st(classes.columnDisplayContainer)}>
                <ColumnText>Booking Time</ColumnText>
                <ColumnText size="tiny">{formatDate(new Date(booking.created), 'MMM DD, HH:mm a')}</ColumnText>
            </div>
        );
    };

    static ClientName = ({data: {booking}}) => {
        const {formInfo} = booking;
        const {contactDetails, paymentSelection} = formInfo;
        // TODO: extract guests from paymentSelection (if numberOfParticipants > 1)
        //  unsure how to handle it tho since paymentSelection is an array
        return (
            <div className={st(classes.columnDisplayContainer)}>
                <ColumnText>{contactDetails.firstName} {contactDetails.lastName}</ColumnText>
            </div>
        );
    };

    static ServiceAndSession = ({services, data: {booking}}) => {
        const {bookedEntity} = booking;
        const service = services[bookedEntity.serviceId];
        if (!service) {
            return null;
        }
        const {singleSession} = bookedEntity;

        return (
            <div className={st(classes.columnDisplayContainer)}>
                <ColumnText>{service.info.name}</ColumnText>
                <ColumnText size="tiny">
                    {formatDate(new Date(singleSession.start), 'MMM DD, HH:mm a')} - {getTimeDifference(singleSession.start, singleSession.end)}h
                </ColumnText>
            </div>
        );
    };

    static Staff = ({staff, data: {booking}}) => {
        const {bookedResources} = booking;

        return (
            <div className={st(classes.columnDisplayContainer)}>
                {
                    bookedResources
                        .filter(resource => !!staff[resource.id])
                        .map(resource => <ColumnText key={resource.id}>{resource.name}</ColumnText>)
                }
            </div>
        );
    };

    static BookingAndAttendance = ({data: {booking}}) => {


        return null;
    };

    static PaymentStatus = ({data: {booking}}) => {
        return null;
    };

    static Payment = observer(({data: {booking, focused}}) => {
        const {paymentDetails} = booking;
        const {state} = paymentDetails;
        const paymentInfo = PAYMENT_MAP[state] || {};
        const {balance, balance: {finalPrice}} = paymentDetails;
        const {amountReceived} = balance;
        const {amount} = finalPrice;
        return (
            <div className={st(classes.rowDisplayContainer)}>
                <ColumnText>
                    {getSymbolFromCurrency(finalPrice.currency)} {state === 'COMPLETE' ? amount : (amount - amountReceived)} {paymentInfo.name}
                </ColumnText>
                {focused ? <BookingsListColumn.PaymentDetailsTooltip data={paymentDetails}/> : null}
                {/*<BookingsListColumn.PaymentDetailsTooltip data={paymentDetails}/>*/}
            </div>
        );
    });

    static PaymentDetailsTooltip = ({data}) => {
        const {couponDetails} = data;
        const [isFocused, setIsFocused] = useState(false);

        const setFocused = useCallback(() => {
            setIsFocused(true);
        }, []);

        const setUnfocused = useCallback(() => {
            setIsFocused(false);
        }, []);


        const boldedTextStyle = {fontWeight: 'bold', fontSize: '14px', color: 'white', marginBottom: '0px'};
        const normalTextStyle = {fontWeight: 'normal', fontSize: '12px', color: 'white'};

        const paymentContent = (
            <div className={st(classes.columnDisplayContainer)}>
                <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                    <ColumnText style={boldedTextStyle}>Booking Platform</ColumnText>
                    <ColumnText style={normalTextStyle}>Website</ColumnText>
                </div>
                <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                    <ColumnText style={boldedTextStyle}>CoupnName</ColumnText>
                    <ColumnText style={normalTextStyle}>Website</ColumnText>
                </div>
                <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                    <ColumnText style={boldedTextStyle}>Payment Method & Details</ColumnText>
                    <ColumnText style={normalTextStyle}>Paid Online with Credit Card</ColumnText>
                </div>
            </div>
        );

        return (
            <Tooltip onShow={setFocused} onHide={setUnfocused} content={paymentContent} size="medium">
                <StatusAlert size={18} className={st(classes.paymentDetailsTooltipIcon, isFocused ? classes.paymentDetailsTooltipIconFocused : '')}/>
            </Tooltip>
        );
    };

}
