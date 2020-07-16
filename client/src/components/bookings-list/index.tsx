import React from 'react';
import {st, classes} from './style.st.css';

export interface BookingsListProps {

}

export const BookingsList: React.FC<BookingsListProps> = (props) => {
    return (
        <div className={classes.bookingsListContainer}>
            This is Bookings List
        </div>
    );
};
