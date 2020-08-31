import React from 'react';
import {Text} from 'wix-style-react';

const ColumnText = (props) => {
    return (
        <Text style={{color: '#32536a', direction: props.isRTL ? 'rtl' : undefined}} size="small" {...props}/>
    );
};

export default ColumnText;