import React from 'react';
import {st, classes} from './ReplaceStaffModal.st.css';
import {Box, Text, MessageBoxFunctionalLayout, Modal, Layout, Cell, Notification} from 'wix-style-react';
import {inject, observer} from 'mobx-react';
import {raiseNotification, translate} from '../../utils';
import {formatDate} from 'wix-style-react/src/LocaleUtils';
import RescheduleBox from '../RescheduleBox';
import RescheduleBoxSkeleton from '../RescheduleBox/RescheduleBoxSkeleton';

const MAX_SLOTS_AMOUNT = 5;

@inject('bookingsListStore')
@observer
export default class ReplaceStaffModal extends React.PureComponent {

    _closeModal = () => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setReplaceStaffModalIsOpen(false);
    };

    _onOk = async () => {
        const {bookingsListStore} = this.props;
        const {replaceStaffModal} = bookingsListStore.store;
        const {selectedSlot} = replaceStaffModal;
        bookingsListStore.setReplaceStaffModalData('loading', true);
        const success = await bookingsListStore.rescheduleBooking(replaceStaffModal.data.id, selectedSlot);
        bookingsListStore.setReplaceStaffModalData('loading', false);
        if (success) {
            raiseNotification(translate('ReplaceStaffModal.replaceStaffSuccessNotification'), 'success');
            this._closeModal();
        }
    };

    _setSelectedSlot = (slot) => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setReplaceStaffModalData('selectedSlot', slot);
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
        const {replaceStaffModal} = bookingsListStore.store;
        const {slots, selectedSlot} = replaceStaffModal;
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
        const {replaceStaffModal} = bookingsListStore.store;
        const {errorMessage} = replaceStaffModal;

        return (
            <div className={st(classes.errorMessageContainer)}>
                <Layout>
                    <Cell>
                        <Notification
                            show={!!errorMessage}
                            type={'global'}
                            theme={'error'}
                            onClose={() => bookingsListStore.setReplaceStaffModalData('errorMessage', '')}
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
        const {replaceStaffModal} = bookingsListStore.store;
        const {loading, data, slots, errorMessage} = replaceStaffModal;

        if (!data) {
            return null;
        }

        const {formInfo: {contactDetails: {firstName}}, bookedEntity: {title, singleSession, setOfSessions}} = data;
        const startDate = formatDate(new Date(singleSession ? singleSession.start : setOfSessions.firstSessionStart), 'MMM DD');

        return (
            <Box direction="vertical">
                <Text size="tiny" style={{padding: '10px 5px'}}>{translate('ReplaceStaffModal.chooseNewStaffLabel', {name: firstName, booking: title, date: startDate})}</Text>
                {this._renderErrorMessage()}
                {/*{loading && !slots ? this._renderSlotsSkeleton() : this._renderSlots()}*/}
            </Box>
        );
    };

    render() {
        const {bookingsListStore} = this.props;
        const {replaceStaffModal} = bookingsListStore.store;
        const {loading, isOpen, selectedSlot} = replaceStaffModal;
        return (
            <Box>
                <Modal isOpen={isOpen} onRequestClose={this._closeModal} shouldCloseOnOverlayClick={true}>
                    <MessageBoxFunctionalLayout
                        width={'500px'}
                        title={translate('ReplaceStaffModal.title')}
                        confirmText={translate('ReplaceStaffModal.confirmButtonText')}
                        cancelText={translate('ReplaceStaffModal.cancelButtonText')}
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