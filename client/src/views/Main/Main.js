import React from 'react';
import {st, classes} from './style.st.css';
import BookingsList from '../../components/BookingsList';
import {getDefaultValue} from '../../components/CalendarPanelDatePicker/CalendarPanelDatePicker';

import {inject, observer} from 'mobx-react';
import mock from './bookingEntriesMock.json';

@inject('bookingsListStore')
@observer
export default class Main extends React.Component {

    componentDidMount() {
        this._onFiltersChanged('dateRange', getDefaultValue());
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

    render() {
        const {bookingsListStore} = this.props;
        const {bookingsEntries, metadata} = bookingsListStore.store;

        return (
            <div className={classes.mainContainer}>
                <BookingsList
                    metadata={metadata}
                    bookingEntries={bookingsEntries}
                    onFilterChanged={this._onFiltersChanged}
                    filters={this._getFilters()}
                />
            </div>
        );
    }
}