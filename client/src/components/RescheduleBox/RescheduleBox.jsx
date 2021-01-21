import React, {useCallback} from 'react';
import {st, classes} from './RescheduleBox.st.css';
import {Text} from 'wix-style-react';
import {timeOnlyFormat} from '../../utils';
import moment from 'moment-timezone';

const RescheduleBox = (props) => {
    const {data, isSelected, loading} = props;
    const {start} = data;
    const startTime = moment(start.timestamp).format(timeOnlyFormat);

    const getRescheduleBoxStyle = useCallback(() => {
        return st(classes.rescheduleBoxContainer, classes.rescheduleBox,
            isSelected && !loading ? classes.rescheduleBoxSelected : null, loading ? classes.rescheduleBoxDisabled : classes.rescheduleBoxEnabled
        );
    }, [isSelected, loading]);

    return (
        <div onClick={() => props.onClick(data)} className={getRescheduleBoxStyle()}>
            <Text size="medium" light={loading}>{startTime}</Text>
        </div>
    );
};

export default RescheduleBox;