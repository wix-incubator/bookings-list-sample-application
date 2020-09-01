import React from 'react';
import {st, classes} from './ReplaceStaffModal.st.css';
import {Box, Text, MessageBoxFunctionalLayout, Modal, Layout, Cell, Notification, Dropdown} from 'wix-style-react';
import {inject, observer} from 'mobx-react';
import {raiseNotification, translate} from '../../utils';
import moment from 'moment-timezone';

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
        const {selectedStaffMember} = replaceStaffModal;
        bookingsListStore.setReplaceStaffModalData('loading', true);
        const success = await bookingsListStore.replaceStaffMember(
            replaceStaffModal.data.id,
            replaceStaffModal.data.bookedEntity.singleSession.sessionId,
            selectedStaffMember.schedules[0].id,
            replaceStaffModal.data.bookedEntity.singleSession.start,
            replaceStaffModal.data.bookedEntity.singleSession.end
        );
        bookingsListStore.setReplaceStaffModalData('loading', false);
        if (success) {
            raiseNotification(translate('ReplaceStaffModal.replaceStaffSuccessNotification'), 'success');
            this._closeModal();
        }
    };

    _setSelectedStaffMember = (staffMember) => {
        const {bookingsListStore} = this.props;
        bookingsListStore.setReplaceStaffModalData('selectedStaffMember', staffMember);
    };

    _renderAvailableStaffDropdown = () => {
        const {bookingsListStore} = this.props;
        const {replaceStaffModal, staff} = bookingsListStore.store;
        const {selectedStaffMember} = replaceStaffModal;

        const staffMembersOptions = Object.values(staff).map(staffMember => ({
            ...staffMember,
            value: staffMember.name
        }));

        return (
            <div className={st(classes.availableStaffContainer)}>
                <Dropdown
                    selectedId={selectedStaffMember && selectedStaffMember.id}
                    options={staffMembersOptions}
                    onSelect={this._setSelectedStaffMember}
                />
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
        const {data} = replaceStaffModal;

        if (!data) {
            return null;
        }

        const {formInfo: {contactDetails: {firstName}}, bookedEntity: {title, singleSession, setOfSessions}} = data;
        const startDate = moment(singleSession ? singleSession.start : setOfSessions.firstSessionStart).format('HH:mm, MMM DD');

        return (
            <Box direction="vertical">
                <Text size="tiny" style={{padding: '10px 5px'}}>{translate('ReplaceStaffModal.chooseNewStaffLabel', {name: firstName, booking: title, date: startDate})}</Text>
                {this._renderErrorMessage()}
                {this._renderAvailableStaffDropdown()}
            </Box>
        );
    };

    render() {
        const {bookingsListStore} = this.props;
        const {replaceStaffModal} = bookingsListStore.store;
        const {loading, isOpen, currentStaffMember, selectedStaffMember} = replaceStaffModal;

        return (
            <Box>
                <Modal isOpen={isOpen} onRequestClose={this._closeModal} shouldCloseOnOverlayClick={!loading}>
                    <MessageBoxFunctionalLayout
                        width={'600px'}
                        title={translate('ReplaceStaffModal.title')}
                        confirmText={translate('ReplaceStaffModal.confirmButtonText')}
                        cancelText={translate('ReplaceStaffModal.cancelButtonText')}
                        onOk={this._onOk}
                        onCancel={this._closeModal}
                        onClose={this._closeModal}
                        disableConfirmation={loading || (currentStaffMember && selectedStaffMember && currentStaffMember.id === selectedStaffMember.id)}
                        disableCancel={loading}
                    >
                        {this._renderContent()}
                    </MessageBoxFunctionalLayout>
                </Modal>
            </Box>
        );
    }
}