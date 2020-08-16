import React, {useCallback, useState} from 'react';
import {classes, st} from '../BookingsListColumns.st.css';
import {translate} from '../../../utils';
import {Tooltip} from 'wix-style-react';
import ColumnText from '../ColumnText/ColumnText';
import StatusAlert from 'wix-ui-icons-common/StatusAlert';
import LanguagesSmall from 'wix-ui-icons-common/LanguagesSmall';
import MobileSmall from 'wix-ui-icons-common/MobileSmall';

const BOOKING_PLATFORM_MAP = {
    // UNDEFINED_PLATFORM: {localeLabelKey: 'BookingPlatform.unavailable', icon: null},
    WEB: {localeLabelKey: 'BookingPlatform.web', icon: <LanguagesSmall className={st(classes.platformIcon)}/>},
    MOBILE_APP: {localeLabelKey: 'BookingPlatform.mobile', icon: <MobileSmall className={st(classes.platformIcon)}/>}
};

const WIX_PAY_DETAILS_MAP = {
    inPerson: {localeLabelKey: 'WixPayDetails.inPerson'},
    payPal: {localeLabelKey: 'WixPayDetails.payPal'},
    offline: {localeLabelKey: 'WixPayDetails.offline'}
};

const PaymentDetailsTooltip = (props) => {
    const {visible, data: {paymentDetails = {}, bookingSource}} = props;

    const {balance = {}} = paymentDetails;
    const {amountReceived} = balance;

    const {couponDetails, wixPayMultipleDetails, paidPlanDetails} = paymentDetails;
    const {platform} = bookingSource;
    const bookingPlatform = BOOKING_PLATFORM_MAP[platform];
    const [isFocused, setIsFocused] = useState(false);

    const setFocused = useCallback(() => {
        setIsFocused(true);
    }, []);

    const setUnfocused = useCallback(() => {
        setIsFocused(false);
    }, []);

    if (!visible) {
        return <div style={{height: '22px'}}/>;
    }

    const boldedTextStyle = {fontWeight: 'bold', fontSize: '14px', color: 'white', marginBottom: '0px'};
    const normalTextStyle = {fontWeight: 'normal', fontSize: '12px', color: 'white'};

    const bookingPlatformElement = bookingPlatform ? (
            <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                <ColumnText style={boldedTextStyle}>{translate('BookingInfoTooltip.bookingPlatform')}</ColumnText>
                <div className={st(classes.rowDisplayContainer)}>
                    {bookingPlatform.icon}
                    <ColumnText style={normalTextStyle}>{translate(bookingPlatform.localeLabelKey)}</ColumnText>
                </div>
            </div>
        )
        :
        null;

    const couponDetailsElement = couponDetails ?
        <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
            <ColumnText style={boldedTextStyle}>{translate('BookingInfoTooltip.couponName')}</ColumnText>
            <ColumnText style={normalTextStyle}>{couponDetails.couponName}</ColumnText>
        </div>
        :
        null;

    const paymentMethodAndDetailsElement = +amountReceived ? (
            <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
                <ColumnText style={boldedTextStyle}>{translate('BookingInfoTooltip.paymentMethodAndDetails')}</ColumnText>
                {
                    wixPayMultipleDetails.map((wixPayDetails, index) => {
                            const paymentVendor = WIX_PAY_DETAILS_MAP[wixPayDetails.paymentVendorName] || {};
                            return (
                                <ColumnText
                                    key={`${index}-${wixPayDetails.orderId}`}
                                    style={normalTextStyle}
                                >
                                    {translate(paymentVendor.localeLabelKey)} - {wixPayDetails.orderAmount}
                                </ColumnText>
                            );
                        }
                    )
                }
            </div>
        )
        :
        null;

    const paidPlanDetailsElement = paidPlanDetails ?
        <div className={st(classes.columnDisplayContainer, classes.paymentContentSection)}>
            <ColumnText style={boldedTextStyle}>{translate('BookingInfoTooltip.paidPlanDetails')}</ColumnText>
            <ColumnText style={normalTextStyle}>{paidPlanDetails.planName}</ColumnText>
        </div>
        :
        null;

    const paymentContent = (
        <div className={st(classes.columnDisplayContainer, classes.paymentContent)}>
            {bookingPlatformElement}
            {couponDetailsElement}
            {paymentMethodAndDetailsElement}
            {paidPlanDetailsElement}
        </div>
    );

    if (!bookingPlatform && !couponDetails && !+amountReceived && !paidPlanDetails) {
        return null;
    }

    return (
        <Tooltip maxWidth={-1} className={st(classes.paymentDetailsTooltip)} onShow={setFocused} onHide={setUnfocused} content={paymentContent} size="medium">
            <StatusAlert size={18} className={st(classes.paymentDetailsTooltipIcon, isFocused ? classes.paymentDetailsTooltipIconFocused : '')}/>
        </Tooltip>
    );
};

export default PaymentDetailsTooltip;