import React from 'react';
import {st, classes} from './RescheduleModal.st.css';
import {Box, Text, MessageBoxFunctionalLayout, Modal, Layout, Cell, Notification, DatePicker} from 'wix-style-react';
import {inject, observer} from 'mobx-react';
import {raiseNotification, translate} from '../../utils';
import RescheduleBox from '../RescheduleBox';
import RescheduleBoxSkeleton from '../RescheduleBox/RescheduleBoxSkeleton';
import moment from 'moment-timezone';
import {range, groupBy} from 'lodash';

const START_HOUR_OF_DAY = 5;
const PARTS_OF_DAY = [{name: 'morning', skeletonBoxes: 3}, {name: 'afternoon', skeletonBoxes: 2}, {name: 'evening', skeletonBoxes: 4}];

@inject('bookingsListStore')
@observer
export default class RescheduleModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {selectedDate: null};
    }

    _closeModal = () => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setRescheduleModalIsOpen(false);
        this.setState({selectedDate: null});
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
                {PARTS_OF_DAY.map((dayPart, index) => {
                    return (
                        <div key={index} className={st(classes.dayPart)}>
                            <Text size="medium">{translate(`RescheduleModal.DayParts.${dayPart.name}`)}</Text>
                            {range(dayPart.skeletonBoxes).map((_, index) => <RescheduleBoxSkeleton key={index}/>)}
                        </div>
                    );
                })}
            </div>
        );
    };

    _divideSlotsToDayParts = (slots) => {
        return groupBy(slots, (slot) => {
            const startHour = moment(slot.start.timestamp).hour();
            if (startHour >= START_HOUR_OF_DAY && startHour < 12) {
                return 'morning';
            } else if (startHour >= 12 && startHour < 17) {
                return 'afternoon';
            } else if (startHour >= 17) {
                return 'evening';
            }
        });
    };

    _renderSlots = () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {slots, selectedSlot} = rescheduleModal;
        const dividedSlots = this._divideSlotsToDayParts(slots);
        return (
            <div className={st(classes.slotsContainer)}>
                {PARTS_OF_DAY.map((dayPart, index) => {
                    return (
                        <div key={index} className={st(classes.dayPart)}>
                            <Text size="medium">{translate(`RescheduleModal.DayParts.${dayPart.name}`)}</Text>
                            {dividedSlots[dayPart.name] ?
                                dividedSlots[dayPart.name].map((slot, index) =>
                                    <RescheduleBox key={index} onClick={this._setSelectedSlot} isSelected={slot.clientId === (selectedSlot && selectedSlot.clientId)} data={slot}/>)
                                : <Text size="medium">No Available Hours</Text>}
                        </div>
                    );
                })}
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

    _onDateSelection = (value) => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        this.setState({selectedDate: value});
        bookingsListStore.fetchScheduleSlots(rescheduleModal.data.bookedEntity.scheduleId, moment(value).add(START_HOUR_OF_DAY, 'h').toISOString(), moment(value).add(24, 'h').toISOString());
    };

    _displayAfterDateSelection = () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const {loading, slots} = rescheduleModal;
        const {selectedDate} = this.state;
        if (selectedDate) {
            return loading || !slots ? this._renderSlotsSkeleton() : this._renderSlots();
        }
    };

    _renderContent = () => {
        const {bookingsListStore} = this.props;
        const {rescheduleModal} = bookingsListStore.store;
        const { data} = rescheduleModal;
        const {selectedDate} = this.state;
        if (!data) {
            return null;
        }
        const {formInfo: {contactDetails: {firstName}}, bookedEntity: {title, singleSession, setOfSessions}} = data;
        const startDate = moment(singleSession ? singleSession.start : setOfSessions.firstSessionStart).format('MMM DD');
        return (
            <Box direction="vertical">
                <Text size="medium" style={{padding: '10px 5px'}}>{translate('RescheduleModal.chooseNewSlotLabel', {name: firstName, booking: title, date: startDate})}</Text>
                {this._renderErrorMessage()}
                <DatePicker
                    value={selectedDate}
                    onChange={this._onDateSelection}
                    excludePastDates
                />
                {this._displayAfterDateSelection()}
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
                        width={'40vw'}
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