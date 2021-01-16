import React from 'react';
import {st, classes} from './RescheduleBox.st.css';
import {Skeleton, Box} from 'wix-style-react';

const RescheduleBoxSkeleton = () => {
    return (
        <Box className={st(classes.rescheduleBoxContainer)}>
            <Skeleton
                alignment={'middle'}
                className={st(classes.rescheduleBoxSkeleton)}
                spacing="small"
                content={[
                    {
                        size: 'medium',
                        type: 'line'
                    }
                ]}
            />
        </Box>
    );
};


export default RescheduleBoxSkeleton;