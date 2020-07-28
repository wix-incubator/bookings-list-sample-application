import React from 'react';
import {classes, st} from './RescheduleBox.st.css';
import {Text, Skeleton, Box} from 'wix-style-react';
import {dateOnlyWithoutYearFormat, timeOnlyFormat} from '../../utils';
import {formatDate} from 'wix-style-react/src/LocaleUtils';

const RescheduleBox = (props) => {
    const {data, isSelected} = props;

    const {start} = data;
    const startDate = formatDate(new Date(start.timestamp), dateOnlyWithoutYearFormat);
    const startTime = formatDate(new Date(start.timestamp), timeOnlyFormat);
    return (
        <div onClick={() => props.onClick(data)} className={st(classes.rescheduleBoxContainer, classes.rescheduleBox, isSelected ? classes.rescheduleBoxSelected : null)}>
            <Text size="tiny" className={st(classes.rescheduleBoxLabel)}>{startDate}</Text>
            <Text size="tiny" className={st(classes.rescheduleBoxLabel)}>{startTime}</Text>
        </div>
    );
};

RescheduleBox.SkeletonBox = () => {
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