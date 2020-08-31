import React from 'react';
import {st, classes} from './RescheduleModal.st.css';
import {Box, Text, MessageBoxFunctionalLayout, Modal, Layout, Cell, Notification} from 'wix-style-react';
import {inject, observer} from 'mobx-react';
import {raiseNotification, translate} from '../../utils';
import RescheduleBox from '../RescheduleBox';
import RescheduleBoxSkeleton from '../RescheduleBox/RescheduleBoxSkeleton';
import moment from 'moment-timezone';

const MAX_SLOTS_AMOUNT = 5;

@inject('bookingsListStore')
@observer
export default class RescheduleModal extends React.PureComponent {

    _closeModal = () => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setRescheduleModalIsOpen(false);
    };

    _onOk = async () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {selectedSlot} = rescheduleModal;
        bookingsListStore.setRescheduleModalData('loading', true);
        const success = await bookingsListStore.rescheduleBooking(rescheduleModal.data.id, selectedSlot);
        bookingsListStore.setRescheduleModalData('loading', false);
        if (success) {
            raiseNotification(translate('RescheduleModal.rescheduleSuccessNotification'), 'success');
            this._closeModal();
        }
    };

    _setSelectedSlot = (slot) => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setRescheduleModalData('selectedSlot', slot);
    };

    _renderSlotsSkeleton = () => {
        return (
            <div className={st(classes.slotsContainer)}>
                {[...Array(MAX_SLOTS_AMOUNT)].map((_, index) => <RescheduleBoxSkeleton key={index}/>)}
            </div>
        );
    };

    _renderSlots = () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {slots, selectedSlot} = rescheduleModal;
        return (
            <div className={st(classes.slotsContainer)}>
                {
                    slots.slice(0, MAX_SLOTS_AMOUNT).map((slot, index) => (
                            <RescheduleBox key={index} onClick={this._setSelectedSlot} isSelected={slot.clientId === (selectedSlot && selectedSlot.clientId)} data={slot}/>
                        )
                    )
                }
            </div>
        );
    };

    _renderErrorMessage = () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {errorMessage} = rescheduleModal;

        return (
            <div className={st(classes.errorMessageContainer)}>
                <Layout>
                    <Cell>
                        <Notification
                            show={!!errorMessage}
                            type={'global'}
                            theme={'error'}
                            onClose={() => bookingsListStore.setRescheduleModalData('errorMessage', '')}
                        >
                            <Notification.TextLabel>{errorMessage}</Notification.TextLabel>
                            <Notification.CloseButton/>
                        </Notification>
                    </Cell>
                </Layout>
            </div>
        );
    };

    _renderContent = () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {loading, data, slots, errorMessage} = rescheduleModal;

        if (!data) {
            return null;
        }

        const {formInfo: {contactDetails: {firstName}}, bookedEntity: {title, singleSession, setOfSessions}} = data;
        const startDate = moment(singleSession ? singleSession.start : setOfSessions.firstSessionStart).format('MMM DD');

        return (
            <Box direction="vertical">
                <Text size="tiny" style={{padding: '10px 5px'}}>{translate('RescheduleModal.chooseNewSlotLabel', {name: firstName, booking: title, date: startDate})}</Text>
                {this._renderErrorMessage()}
                {loading && !slots ? this._renderSlotsSkeleton() : this._renderSlots()}
            </Box>
        );
    };

    render() {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {loading, isOpen, selectedSlot} = rescheduleModal;
        return (
            <Box>
                <Modal isOpen={isOpen} onRequestClose={this._closeModal} shouldCloseOnOverlayClick={true}>
                    <MessageBoxFunctionalLayout
                        width={'500px'}
                        title={translate('RescheduleModal.title')}
                        confirmText={translate('RescheduleModal.confirmButtonText')}
                        cancelText={translate('RescheduleModal.cancelButtonText')}
                        onOk={this._onOk}
                        onCancel={this._closeModal}
                        onClose={this._closeModal}
                        disableConfirmation={loading || !selectedSlot}
                        disableCancel={loading}
                    >
                        {this._renderContent()}
                    </MessageBoxFunctionalLayout>
                </Modal>
            </Box>
        );
    }
}