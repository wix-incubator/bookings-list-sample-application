import React from 'react';
import PropTypes from 'prop-types';
import {st, classes} from './Main.st.css';
import {inject, observer} from 'mobx-react';
import BookingsList from '../../components/BookingsList';
import {getDefaultValue} from '../../components/CalendarPanelDatePicker/CalendarPanelDatePicker';
import RescheduleModal from '../../components/RescheduleModal';
import PaymentModal from '../../components/PaymentModal';
import ReplaceStaffModal from '../../components/ReplaceStaffModal';
import moment from 'moment-timezone';

@inject('bookingsListStore')
@observer
export default class Main extends React.Component {

    componentDidMount() {
        this._init();
    }

    _init = async () => {
        const {bookingsListStore} = this.props;
        await bookingsListStore.loadConstants();
        try {
            const {siteProperties} = bookingsListStore.store;
            const {timeZone, locale: {languageCode}} = siteProperties;
            moment.tz.setDefault(timeZone);
            moment.locale(languageCode);
        } catch (e) {
            console.log('Locale Setup Failure', e);
        }
        this._onFiltersChanged('dateRange', getDefaultValue());
    };

    _onFiltersChanged = (name, value) => {
        const {bookingsListStore} = this.props;
        if (name === 'dateRange') {
            bookingsListStore.updateFilters('startTime', (value.from));
            bookingsListStore.updateFilters('endTime', (value.to));
        } else {
            bookingsListStore.updateFilters(name, value);
        }

        bookingsListStore.resetBookingsEntries();
        bookingsListStore.fetchData();
    };

    _onSortChanged = (fieldName) => {
        // TODO: enable once sorting implemented on the API
        return;
        const {bookingsListStore} = this.props;
        bookingsListStore.resetBookingsEntries();
        bookingsListStore.updateSort(fieldName);
        bookingsListStore.fetchData();
    };

    _getFilters = () => {
        const {bookingsListStore} = this.props;
        const {filters} = bookingsListStore.store;

        const dateRange = {};
        if (filters.startTime) {
            dateRange.from = filters.startTime;
        }
        if (filters.endTime) {
            dateRange.to = filters.endTime;
        }

        return {
            status: filters.status,
            dateRange
        };
    };

    _hasMoreBookings = () => {
        const {bookingsListStore} = this.props;
        const {bookingsMetadata, bookingsEntries} = bookingsListStore.store;

        if (!bookingsMetadata) {
            return true;
        }

        return bookingsMetadata.totalCount > bookingsEntries.length;
    };

    _loadMoreBookings = () => {
        const {bookingsListStore} = this.props;
        const {loadingBookings, paging} = bookingsListStore.store;
        if (!loadingBookings && this._hasMoreBookings()) {
            bookingsListStore.updatePaging('offset', paging.offset + paging.limit);
            bookingsListStore.fetchData(true);
        }
    };

    _openRescheduleBookingModal = (booking) => {
        const {bookingsListStore} = this.props;

        bookingsListStore.setRescheduleModalIsOpen(true);
        bookingsListStore.setRescheduleModalData('data', booking);
        bookingsListStore.fetchScheduleSlots(booking.bookedEntity.scheduleId);
    };

    _openReplaceStaffModal = (booking, currentStaff) => {
        const {bookingsListStore} = this.props;
        const {staff} = booking;

        bookingsListStore.setReplaceStaffModalIsOpen(true);
        bookingsListStore.setReplaceStaffModalData('data', booking);
        if (currentStaff.length) {
            bookingsListStore.setReplaceStaffModalData('currentStaffMember', currentStaff[0]);
            bookingsListStore.setReplaceStaffModalData('selectedStaffMember', currentStaff[0]);
        }
    };

    _onRowClick = (row) => {
        console.logx({row});
    };

    _onPaymentStatusSelect = (booking, option) => {
        const {bookingsListStore} = this.props;

        switch (option.id) {
            case 'PAID_IN_PERSON':
                bookingsListStore.setPaymentModalIsOpen(true);
                bookingsListStore.setPaymentModalData('data', booking);
                break;
            default:
                break;
        }
    };

    _onBookingAndAttendanceStatusSelect = (booking, option) => {
        const {bookingsListStore} = this.props;

        switch (option.id) {
            case 'APPROVE':
                bookingsListStore.confirmBooking(booking.id);
                break;
            case 'DECLINE':
                bookingsListStore.declineBooking(booking.id);
                break;
            case 'CHECKED_IN':
            case 'NO_SHOW':
                const {formInfo = {}} = booking;
                const {paymentSelection = []} = formInfo;
                const numberOfParticipants = paymentSelection.length ? paymentSelection[0].numberOfParticipants : 1;
                bookingsListStore.setAttendance(booking.id, option.id === 'CHECKED_IN', numberOfParticipants);
                break;
            default:
                break;
        }
    };

    render() {
        const {bookingsListStore} = this.props;
        const {constantsLoaded, loadingBookings, services, staff, bookingsEntries, bookingsMetadata, sort} = bookingsListStore.store;

        return (
            <div className={st(classes.mainContainer)}>
                <RescheduleModal/>
                <ReplaceStaffModal/>
                <PaymentModal/>
                <BookingsList
                    bookingsMetadata={bookingsMetadata}
                    services={services}
                    staff={staff}
                    bookingEntries={bookingsEntries}
                    onRowClick={this._onRowClick}
                    openRescheduleBookingModal={this._openRescheduleBookingModal}
                    openReplaceStaffModal={this._openReplaceStaffModal}
                    onPaymentStatusSelect={this._onPaymentStatusSelect}
                    onBookingAndAttendanceStatusSelect={this._onBookingAndAttendanceStatusSelect}
                    onFilterChanged={this._onFiltersChanged}
                    onSortChanged={this._onSortChanged}
                    filters={this._getFilters()}
                    sort={sort}
                    setRowFocused={bookingsListStore.setRowFocused}
                    loading={loadingBookings}
                    constantsLoaded={constantsLoaded}
                    loadMore={this._loadMoreBookings}
                    hasMore={this._hasMoreBookings()}
                />
            </div>
        );
    }
}

Main.propTypes = {
    bookingsListStore: PropTypes.object
};