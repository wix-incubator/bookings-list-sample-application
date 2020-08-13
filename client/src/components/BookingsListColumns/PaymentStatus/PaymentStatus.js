import {observer} from 'mobx-react';
import {BadgeDropdown} from '../../BadgeDropdown/BadgeDropdown';
import React from 'react';
import {translate} from '../../../utils';
import {extractPaymentBalance} from '../utils';

const getPaymentStatusOptions = () => [
    {id: 'NOT_PAID', skin: 'danger', text: translate('PaymentStatusDropdown.notPaid')},
    {id: 'PAID', skin: 'general', text: translate('PaymentStatusDropdown.paid')},
    {id: 'PAID_IN_PERSON', skin: 'general', text: translate('PaymentStatusDropdown.paidInPerson')},
    {id: 'DEPOSIT_PAID', skin: 'warning', text: translate('PaymentStatusDropdown.depositPaid')}
];

const PAYMENT_STATUS_MAP = {
    UNSPECIFIED_PAYMENT_STATUS: {localeLabelKey: 'PaymentStatus.unspecifiedPaymentStatus'},
    NOT_PAID: {localeLabelKey: 'PaymentStatus.notPaid'},
    PAID: {localeLabelKey: 'PaymentStatus.paid'},
    PARTIALLY_REFUNDED: {localeLabelKey: 'PaymentStatus.partiallyRefunded'},
    FULLY_REFUNDED: {localeLabelKey: 'PaymentStatus.fullyRefunded'},
    PENDING: {localeLabelKey: 'PaymentStatus.pending'}
};


const PaymentStatus = observer((props) => {
    const {onPaymentStatusSelect, data: {booking}} = props;
    const {fullyPaid, amountReceived} = extractPaymentBalance(booking);

    const hasDeposit = !fullyPaid && +amountReceived > 0;
    let paymentStatusId;
    let paymentStatusOptions;
    if (fullyPaid) {
        paymentStatusId = 'PAID';
        paymentStatusOptions = getPaymentStatusOptions().filter(option => option.id === 'PAID');
    } else if (!fullyPaid && hasDeposit) {
        paymentStatusId = 'DEPOSIT_PAID';
        paymentStatusOptions = getPaymentStatusOptions().filter(option => ['PAID_IN_PERSON', 'DEPOSIT_PAID'].includes(option.id));
    } else {
        paymentStatusId = 'NOT_PAID';
        paymentStatusOptions = getPaymentStatusOptions().filter(option => ['PAID_IN_PERSON', 'NOT_PAID'].includes(option.id));
    }

    return (
        <BadgeDropdown
            skin="general"
            selectedId={paymentStatusId}
            disabled={paymentStatusId === 'PAID'}
            type="outlined"
            onSelect={onPaymentStatusSelect}
            options={paymentStatusOptions}
        />
    );
});

export default PaymentStatus;