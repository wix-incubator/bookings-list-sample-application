import React from 'react';
import {classes, st} from './RescheduleBox.st.css';
import {Text, Skeleton, Box} from 'wix-style-react';
import {dateOnlyWithoutYearFormat, timeOnlyFormat} from '../../utils';
import {formatDate} from 'wix-style-react/src/LocaleUtils';

const RescheduleBox = (props) => {
    const {data} = props;

    const {start} = data;
    const startDate = formatDate(new Date(start.timestamp), dateOnlyWithoutYearFormat);
    const startTime = formatDate(new Date(start.timestamp), timeOnlyFormat);
    return (
        <div onClick={() => console.log('clicked')} className={st(classes.rescheduleBoxContainer, classes.rescheduleBox)}>
            <Text size="tiny" className={st(classes.rescheduleBoxLabel)}>{startDate}</Text>
            <Text size="tiny" className={st(classes.rescheduleBoxLabel)}>{startTime}</Text>
        </div>
    );
};

RescheduleBox.Skeleton = () => {
    return (
        <Box className={st(classes.rescheduleBoxContainer)}>
            <Skeleton
                className={st(classes.rescheduleBoxSkeleton)}
                spacing="small"
                content={[
                    {
                        size: 'medium',
                        type: 'line'
                    },
                    {
                        size: 'large',
                        type: 'line'
                    }
                ]}
            />
        </Box>
    );
};

export default RescheduleBox;