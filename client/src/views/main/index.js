import React from 'react';
import {st, classes} from './style.st.css';
import BookingsList from '../../components/BookingsList';

import mock from './bookingEntries.json';
import {inject, observer} from 'mobx-react';

export const Main: React.FC = inject('bookingsListStore')(observer((props) => {
    const {bookingsListStore} = props;
    return (
        <div className={classes.mainContainer}>
            <BookingsList
                bookingEntries={mock.bookingsEntries}
                onFilterChanged={bookingsListStore.updateFilters}
            />
        </div>
    );
}));
