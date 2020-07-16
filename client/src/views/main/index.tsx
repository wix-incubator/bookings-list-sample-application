import React from 'react';
import {st, classes} from './style.st.css';
import {BookingsList} from '../../components/bookings-list';

export const Main: React.FC = () => {
    return (
        <div className={classes.mainContainer}>
            <BookingsList/>
        </div>
    );
};
