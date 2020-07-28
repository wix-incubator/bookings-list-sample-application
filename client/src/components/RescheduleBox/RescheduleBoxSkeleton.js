import React from 'react';
import {st, classes} from './RescheduleBox.st.css';
import {Skeleton, Box} from 'wix-style-react';

const RescheduleBoxSkeleton = () => {
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


export default RescheduleBoxSkeleton;