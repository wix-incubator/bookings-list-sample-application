import React from 'react';
import {classes, st} from '../BookingsListColumns.st.css';
import ColumnText from '../ColumnText/ColumnText';

const Staff = (props) => {
    const {staff, data: {booking}} = props;
    const {bookedResources = []} = booking;

    return (
        <div className={st(classes.columnDisplayContainer)}>
            {
                bookedResources
                    .filter(resource => !!staff[resource.id])
                    .map(resource => <ColumnText key={resource.id}>{resource.name}</ColumnText>)
            }
        </div>
    );
};

export default Staff;