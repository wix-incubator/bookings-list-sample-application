import React from 'react';
import {st, classes} from './PaymentModal.st.css';
import {Box, Text, MessageBoxFunctionalLayout, Modal} from 'wix-style-react';
import {inject, observer} from 'mobx-react';
import {translate} from '../../utils';

@inject('bookingsListStore')
@observer
export default class PaymentModal extends React.PureComponent {

    _closeModal = () => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setPaymentModalIsOpen(false);
    };

    _onOk = async () => {
        const {bookingsListStore} = this.props;
        const {paymentModal} = bookingsListStore.store;
        bookingsListStore.setPaymentModalData('loading', true);
        const success = await bookingsListStore.markBookingAsPaid(paymentModal.data.id);
        bookingsListStore.setPaymentModalData('loading', false);
        if (success) {
            this._closeModal();
        }
    };

    _renderContent = () => {
        const {bookingsListStore} = this.props;
        const {paymentModal} = bookingsListStore.store;
        const {data} = paymentModal;

        if (!data) {
            return null;
        }

        const {formInfo: {contactDetails: {firstName, lastName}}} = data;

        return (
            <Box direction="vertical">
                <Text size="small" style={{padding: '10px 5px'}}>{translate('PaymentModal.message', {name: `${firstName} ${lastName}`})}</Text>
            </Box>
        );
    };

    render() {
        const {bookingsListStore} = this.props;
        const {paymentModal} = bookingsListStore.store;
        const {loading, isOpen} = paymentModal;
        return (
            <Box>
                <Modal isOpen={isOpen} onRequestClose={this._closeModal} shouldCloseOnOverlayClick={true}>
                    <MessageBoxFunctionalLayout
                        width={'600px'}
                        maxHeight={'230px'}
                        title={translate('PaymentModal.title')}
                        confirmText={translate('PaymentModal.confirmButtonText')}
                        cancelText={translate('PaymentModal.cancelButtonText')}
                        onOk={this._onOk}
                        onCancel={this._closeModal}
                        onClose={this._closeModal}
                        disableConfirmation={loading}
                        disableCancel={loading}
                    >
                        {this._renderContent()}
                    </MessageBoxFunctionalLayout>
                </Modal>
            </Box>
        );
    }
}