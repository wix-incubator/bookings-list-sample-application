import React from 'react';
import {observer} from 'mobx-react';
import getSymbolFromCurrency from 'currency-symbol-map';
import {translate} from '../../../utils';
import {classes, st} from '../BookingsListColumns.st.css';
import ColumnText from '../ColumnText/ColumnText';
import PaymentDetailsTooltip from '../PaymentDetailsTooltip/PaymentDetailTooltip';
import {extractPaymentBalance} from '../utils';

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

const Payment = observer((props) => {
    const {data: {booking, focused}} = props;
    const {amount, currency, fullyPaid, amountReceived} = extractPaymentBalance(booking);
    const currencySymbol = getSymbolFromCurrency(currency);

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
            <PaymentDetailsTooltip data={booking} visible={focused}/>
        </div>
    );
});

export default Payment;