import React from 'react';
import {st, classes} from './style.st.css';
import BookingsList from '../../components/bookings-list';

import mock from './bookingEntries.json';

export const Main: React.FC = () => {
    return (
        <div className={classes.mainContainer}>
            <BookingsList
                bookingEntries={mock.bookingsEntries}
                onFilterChanged={(value) => console.log(value)}
            />
        </div>
    );
};
