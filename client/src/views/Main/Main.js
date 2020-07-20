import React from 'react';
import {st, classes} from './style.st.css';
import BookingsList from '../../components/BookingsList';
import {getDefaultValue} from '../../components/CalendarPanelDatePicker/CalendarPanelDatePicker';

import {inject, observer} from 'mobx-react';
import mock from './bookingEntriesMock.json';

@inject('bookingsListStore')
@observer
export default class Main extends React.PureComponent {

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
    };

    render() {
        const {bookingsListStore} = this.props;
        return (
            <div className={classes.mainContainer}>
                <BookingsList
                    bookingEntries={mock.bookingsEntries}
                    onFilterChanged={this._onFiltersChanged}
                />
            </div>
        );
    }
}