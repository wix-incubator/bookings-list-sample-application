import React from 'react';
import {st, classes} from './Main.st.css';
import BookingsList from '../../components/BookingsList';
import {getDefaultValue} from '../../components/CalendarPanelDatePicker/CalendarPanelDatePicker';

import {inject, observer} from 'mobx-react';
import RescheduleModal from '../../components/RescheduleModal';
import PaymentModal from '../../components/PaymentModal';

@inject('bookingsListStore')
@observer
export default class Main extends React.Component {

    componentDidMount() {
        const {bookingsListStore} = this.props;
        this._onFiltersChanged('dateRange', getDefaultValue());
        bookingsListStore.loadConstants();
    }

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

    _onRowClick = (row) => {
        console.logx({row});
    };

    _onPaymentStatusSelect = (booking, option) => {
        const {bookingsListStore} = this.props;

        if (option.id === 'PAID') {
            bookingsListStore.setPaymentModalIsOpen(true);
            bookingsListStore.setPaymentModalData('data', booking);
        }
    };

    render() {
        const {bookingsListStore} = this.props;
        const {constantsLoaded, loadingBookings, services, staff, bookingsEntries, bookingsMetadata, sort} = bookingsListStore.store;

        return (
            <div className={st(classes.mainContainer)}>
                <RescheduleModal/>
                <PaymentModal/>
                <BookingsList
                    bookingsMetadata={bookingsMetadata}
                    services={services}
                    staff={staff}
                    bookingEntries={bookingsEntries}
                    onRowClick={this._onRowClick}
                    openRescheduleBookingModal={this._openRescheduleBookingModal}
                    onPaymentStatusSelect={this._onPaymentStatusSelect}
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