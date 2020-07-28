import React, {useCallback, useState} from 'react';
import {Badge, BadgeSelect, Text, Tooltip} from 'wix-style-react';
import {formatDate} from 'wix-style-react/src/LocaleUtils';
import {st, classes} from './BookingsListColumns.st.css';
import {dateOnlyFormat, dayHourFormat, getTimeDifference, timeOnlyFormat, translate} from '../../utils';
import {observer} from 'mobx-react';
import getSymbolFromCurrency from 'currency-symbol-map';
import StatusAlert from 'wix-ui-icons-common/StatusAlert';
import LanguagesSmall from 'wix-ui-icons-common/LanguagesSmall';
import MobileSmall from 'wix-ui-icons-common/MobileSmall';
import DateAndTimeSmall from 'wix-ui-icons-common/DateAndTimeSmall';

const ColumnText = (props) => {
    return (
        <Text style={{color: '#32536a'}} size="small" {...props}/>
    );
};

const BOOKING_AND_ATTENDANCE_MAP = {};

const PAYMENT_STATUS_MAP = {
    UNSPECIFIED_PAYMENT_STATUS: {localeLabelKey: 'PaymentStatus.unspecifiedPaymentStatus'},
    NOT_PAID: {localeLabelKey: 'PaymentStatus.notPaid'},
    PAID: {localeLabelKey: 'PaymentStatus.paid'},
    PARTIALLY_REFUNDED: {localeLabelKey: 'PaymentStatus.partiallyRefunded'},
    FULLY_REFUNDED: {localeLabelKey: 'PaymentStatus.fullyRefunded'},
    PENDING: {localeLabelKey: 'PaymentStatus.pending'}
};

const PAYMENT_INFO_MAP = {
    UNDEFINED: {localeLabelKey: 'PaymentInfo.undefined'},
    COMPLETE: {localeLabelKey: 'PaymentInfo.paid'},
    PENDING_CASHIER: {localeLabelKey: 'PaymentInfo.pendingCashier'},
    REJECTED: {localeLabelKey: 'PaymentInfo.rejected'},
    READY: {localeLabelKey: 'PaymentInfo.ready'},
    CANCELED: {localeLabelKey: 'PaymentInfo.cancelled'},
    REFUNDED: {localeLabelKey: 'PaymentInfo.refunded'},
    PENDING_MERCHANT: {localeLabelKey: 'PaymentInfo.pendingMerchant'},
    WIX_PAY_FAILURE: {localeLabelKey: 'PaymentInfo.wixPayFailure'},
    PENDING_MARK_AS_PAID: {localeLabelKey: 'PaymentInfo.pendingMarkAsPaid'},
    PENDING_BUYER: {localeLabelKey: 'PaymentInfo.pendingBuyer'}
};

const BOOKING_PLATFORM_MAP = {
    UNDEFINED_PLATFORM: {localeLabelKey: 'BookingPlatform.unavailable', icon: null},
    WEB: {localeLabelKey: 'BookingPlatform.web', icon: <LanguagesSmall className={st(classes.platformIcon)}/>},
    MOBILE_APP: {localeLabelKey: 'BookingPlatform.mobile', icon: <MobileSmall className={st(classes.platformIcon)}/>}
};

export default class BookingsListColumn extends React.Component {
    static NotAvailable = () => {
        return (
            <ColumnText>{translate('BookingsList.TableColumns.notAvailable')}</ColumnText>
        );
    };

    static BookingTime = (props) => {
        const {data: {booking = {}}} = props;
        return (
            <div className={st(classes.columnDisplayContainer)}>
                <ColumnText size="small">{formatDate(new Date(booking.created), dateOnlyFormat)}</ColumnText>
                <ColumnText size="tiny">{formatDate(new Date(booking.created), timeOnlyFormat)}</ColumnText>
            </div>
        );
    };

    static ClientName = (props) => {
        const {data: {booking}} = props;
        const {formInfo = {}} = booking;
        const {contactDetails = {}, paymentSelection = []} = formInfo;
        // TODO: extract guests from paymentSelection (if numberOfParticipants > 1)
        //  unsure how to handle it tho since paymentSelection is an array
        const numberOfParticipants = paymentSelection.length ? paymentSelection[0].numberOfParticipants : 1;

        return (
            <div className={st(classes.columnDisplayContainer)}>
                <ColumnText>{contactDetails.firstName} {contactDetails.lastName}</ColumnText>
                {numberOfParticipants > 1 ? <ColumnText size="tiny">+ {numberOfParticipants - 1} Guests</ColumnText> : null}
            </div>
        );
    };

    static ServiceAndSession = observer((props) => {
        const {services, onCalendarClick, data: {allowedActions, booking, focused}} = props;

        const {bookedEntity = {}} = booking;
        const service = services[bookedEntity.serviceId];
        if (!service) {
            return <BookingsListColumn.NotAvailable/>;
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

    static Staff = (props) => {
        const {staff, data: {booking}} = props;
        const {bookedResources = []} = booking;

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

    static BookingAndAttendance = (props) => {
        const {data: {booking}} = props;
        return <BookingsListColumn.NotAvailable/>;
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

        // TODO: return this for "disabled" option
        // return (
        //     <Badge type="outlined" skin="general">Paid</Badge>
        // );

        return (
            <BadgeSelect
                selectedId={booking.selectedBookingId}
                disabled={true}
                type="outlined"
                onSelect={(option) => booking.selectedBookingId = option.id}
                options={options}
            />
        );
    };

    static PaymentStatus = (props) => {
        const {data: {booking}} = props;
        return <BookingsListColumn.NotAvailable/>;
        return null;
    };

    static Payment = observer((props) => {
        const {data: {booking, focused}} = props;
        const {paymentDetails = {}} = booking;
        const {balance = {}} = paymentDetails;
        const {finalPrice = {}} = balance;
        const {amountReceived} = balance;
        const {amount} = finalPrice;

        const currencySymbol = getSymbolFromCurrency(finalPrice.currency);
        const fullyPaid = amount === amountReceived;
        const paymentInfoLabel = translate(`PaymentInfo.${fullyPaid ? 'paid' : 'due'}`);


        const paymentLabel = <ColumnText>{currencySymbol} {fullyPaid ? amount : (amount - amountReceived)} {paymentInfoLabel}</ColumnText>;
        const depositLabel = !fullyPaid && +amountReceived > 0 ?
            <ColumnText>{currencySymbol} {translate('PaymentInfo.onlineDeposit', {count: +amountReceived})}</ColumnText>
            :
            null;

        return (
            <div className={st(classes.rowDisplayContainer)}>
                <div className={st(classes.columnDisplayContainer)}>
                    {paymentLabel}
                    {depositLabel}
                </div>
                {focused ? <BookingsListColumn.PaymentDetailsTooltip data={booking}/> : null}
                {/*<BookingsListColumn.PaymentDetailsTooltip data={booking}/>*/}
            </div>
        );
    });

    static PaymentDetailsTooltip = (props) => {
        const {data: {paymentDetails, bookingSource}} = props;

        const {couponDetails} = paymentDetails;
        const {platform} = bookingSource;
        const bookingPlatform = BOOKING_PLATFORM_MAP[platform];
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
            <div className={st(classes.columnDisplayContainer, classes.paymentContent)}>
                <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                    <ColumnText style={boldedTextStyle}>{translate('BookingInfoTooltip.bookingPlatform')}</ColumnText>
                    <div className={st(classes.rowDisplayContainer)}>
                        {bookingPlatform.icon}
                        <ColumnText style={normalTextStyle}>{translate(bookingPlatform.localeLabelKey)}</ColumnText>
                    </div>
                </div>
                {
                    couponDetails ?
                        <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                            <ColumnText style={boldedTextStyle}>{translate('BookingInfoTooltip.couponName')}</ColumnText>
                            <ColumnText style={normalTextStyle}>{couponDetails.couponName}</ColumnText>
                        </div>
                        :
                        null
                }
                <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                    <ColumnText style={boldedTextStyle}>{translate('BookingInfoTooltip.paymentMethodAndDetails')}</ColumnText>
                    <ColumnText style={normalTextStyle}>TODO: Find out where this value is taken from</ColumnText>
                </div>
            </div>
        );

        return (
            <Tooltip maxWidth={-1} className={st(classes.paymentDetailsTooltip)} onShow={setFocused} onHide={setUnfocused} content={paymentContent} size="medium">
                <StatusAlert size={18} className={st(classes.paymentDetailsTooltipIcon, isFocused ? classes.paymentDetailsTooltipIconFocused : '')}/>
            </Tooltip>
        );
    };

}
