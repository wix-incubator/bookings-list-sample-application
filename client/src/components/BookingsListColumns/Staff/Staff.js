import React from 'react';
import {classes, st} from '../BookingsListColumns.st.css';
import ColumnText from '../ColumnText/ColumnText';
import ReplaceSmall from 'wix-ui-icons-common/ReplaceSmall';
import {observer} from 'mobx-react';
import {isBookingOneOnOne, isBookingSingleSession} from '../../../utils';

const Staff = observer((props) => {
    const {staff, onReplaceClick, data: {booking, focused}} = props;

    const {bookedResources = []} = booking;

    const staffResources = bookedResources.filter(resource => !!staff[resource.id]);

    return (
        <div className={st(classes.rowDisplayContainer)}>
            <div className={st(classes.columnDisplayContainer)}>
                {staffResources.map(resource => <ColumnText key={resource.id}>{resource.name}</ColumnText>)}
            </div>
            {focused && isBookingOneOnOne(booking) ? <ReplaceSmall className={st(classes.staffReplaceIcon)} onClick={() => onReplaceClick(booking, staffResources)}/> : null}
        </div>
    );
});

export default Staff;