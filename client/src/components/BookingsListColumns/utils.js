/**
 *
 * @param booking
 * @returns {{amount: *, downPayAmount: *, currency: *, fullyPaid: boolean, amountReceived: *}}
 */
export const extractPaymentBalance = (booking) => {
    const {paymentDetails = {}} = booking;
    const {balance = {}} = paymentDetails;
    const {finalPrice = {}} = balance;
    const {amountReceived} = balance;
    const {amount, currency, downPayAmount} = finalPrice;

    const fullyPaid = amount === amountReceived;

    return {amount, currency, downPayAmount, fullyPaid, amountReceived};
};