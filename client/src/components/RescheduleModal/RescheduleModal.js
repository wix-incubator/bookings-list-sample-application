import React from 'react';
import {st, classes} from './RescheduleModal.st.css';
import {Box, Text, MessageBoxFunctionalLayout, Modal} from 'wix-style-react';
import {inject, observer} from 'mobx-react';
import {translate} from '../../utils';
import {formatDate} from 'wix-style-react/src/LocaleUtils';
import RescheduleBox from '../RescheduleBox';

const MAX_SLOTS_AMOUNT = 5;

@inject('bookingsListStore')
@observer
export default class RescheduleModal extends React.PureComponent {

    _closeModal = () => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setRescheduleModalIsOpen(false);
    };

    _setSelectedSlot = (slot) => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setRescheduleModalData('selectedSlot', slot);
    };

    _renderSlotsSkeleton = () => {
        return (
            <div className={st(classes.slotsContainer)}>
                {[...Array(MAX_SLOTS_AMOUNT)].map((_, index) => <RescheduleBox.Skeleton key={index}/>)}
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
                            <RescheduleBox key={index} onClick={this._setSelectedSlot} isSelected={slot.clientId === selectedSlot.clientId} data={slot}/>
                        )
                    )
                }
            </div>
        );
    };

    _renderContent = () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {loading, data} = rescheduleModal;

        if (!data) {
            return null;
        }

        const {formInfo: {contactDetails: {firstName}}, bookedEntity: {title, singleSession, setOfSessions}} = data;
        const startDate = formatDate(new Date(singleSession ? singleSession.start : setOfSessions.firstSessionStart), 'MMM DD');

        return (
            <Box direction="vertical">
                <Text size="tiny" style={{padding: '10px 5px'}}>{translate('RescheduleModal.chooseNewSlotLabel', {name: firstName, booking: title, date: startDate})}</Text>
                {loading ? this._renderSlotsSkeleton() : this._renderSlots()}
            </Box>
        );
    };

    render() {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {isOpen} = rescheduleModal;
        return (
            <Box>
                <Modal isOpen={isOpen} onRequestClose={this._closeModal} shouldCloseOnOverlayClick={true}>
                    <MessageBoxFunctionalLayout
                        width={'500px'}
                        title={translate('RescheduleModal.title')}
                        confirmText={translate('RescheduleModal.confirmButtonText')}
                        cancelText={translate('RescheduleModal.cancelButtonText')}
                        onOk={this._closeModal}
                        onCancel={this._closeModal}
                        onClose={this._closeModal}
                    >
                        {this._renderContent()}
                    </MessageBoxFunctionalLayout>
                </Modal>
            </Box>
        );
    }
}