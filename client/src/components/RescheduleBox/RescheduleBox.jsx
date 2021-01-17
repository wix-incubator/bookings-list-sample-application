import React from 'react';
import {st, classes} from './RescheduleBox.st.css';
import {Text} from 'wix-style-react';
import {timeOnlyFormat} from '../../utils';
import moment from 'moment-timezone';

const RescheduleBox = (props) => {
    const {data, isSelected} = props;

    const {start} = data;
    const startTime = moment(start.timestamp).format(timeOnlyFormat);
    return (
        <div onClick={() => props.onClick(data)} className={st(classes.rescheduleBoxContainer, classes.rescheduleBox, isSelected ? classes.rescheduleBoxSelected : null)}>
            <Text size="medium" className={st(classes.rescheduleBoxLabel)}>{startTime}</Text>
        </div>
    );
};

export default RescheduleBox;