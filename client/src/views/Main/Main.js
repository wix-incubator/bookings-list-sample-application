import React from 'react';
import {st, classes} from './Main.st.css';
import BookingsList from '../../components/BookingsList';
import {getDefaultValue} from '../../components/CalendarPanelDatePicker/CalendarPanelDatePicker';

import {inject, observer} from 'mobx-react';

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

        bookingsListStore.fetchData();
    };

    _onSortChanged = (fieldName) => {
        // TODO: enable once sorting implemented on the API
        return;
        const {bookingsListStore} = this.props;
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
        const {metadata, bookingsEntries} = bookingsListStore.store;

        if (!metadata) {
            return true;
        }

        return metadata.totalCount > bookingsEntries.length;
    };

    _loadMoreBookings = () => {
        const {bookingsListStore} = this.props;
        const {loadingBookings} = bookingsListStore.store;
        if (!loadingBookings && this._hasMoreBookings()) {
            bookingsListStore.fetchData(true);
        }
    };

    render() {
        const {bookingsListStore} = this.props;
        const {loadingBookings, services, staff, bookingsEntries, metadata, sort} = bookingsListStore.store;

        return (
            <div className={classes.mainContainer}>
                <BookingsList
                    metadata={metadata}
                    services={services}
                    staff={staff}
                    bookingEntries={bookingsEntries}
                    onFilterChanged={this._onFiltersChanged}
                    onSortChanged={this._onSortChanged}
                    filters={this._getFilters()}
                    sort={sort}
                    setRowFocused={bookingsListStore.setRowFocused}
                    loading={loadingBookings}
                    loadMore={this._loadMoreBookings}
                    hasMore={this._hasMoreBookings()}
                />
            </div>
        );
    }
}