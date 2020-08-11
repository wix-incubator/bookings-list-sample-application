import React from 'react';
import {classes, st} from '../BookingsListColumns.st.css';
import ColumnText from '../ColumnText/ColumnText';
import ReplaceSmall from 'wix-ui-icons-common/ReplaceSmall';
import {observer} from 'mobx-react';

const Staff = observer((props) => {
    const {staff, onReplaceClick, data: {booking, focused}} = props;

    const {bookedResources = []} = booking;

    return (
        <div className={st(classes.rowDisplayContainer)}>
            <div className={st(classes.columnDisplayContainer)}>
                {
                    bookedResources
                        .filter(resource => !!staff[resource.id])
                        .map(resource => <ColumnText key={resource.id}>{resource.name}</ColumnText>)
                }
            </div>
            {focused ? <ReplaceSmall className={st(classes.staffReplaceIcon)} onClick={() => onReplaceClick(booking)}/> : null}
        </div>
    );
});

export default Staff;