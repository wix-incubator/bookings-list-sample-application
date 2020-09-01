import React from 'react';
import {st, classes} from './BadgeDropdown.st.css';
import {Badge, BadgeSelect, Loader} from 'wix-style-react';

export const BadgeDropdown = (props) => {
    const {disabled, loading} = props;

    if (loading) {
        return (
            <div style={{margin: '0 5px'}}>
                <Loader size="tiny"/>
            </div>
        );
    }
    if (disabled) {
        const {options, selectedId} = props;
        const selectedOption = options.find(option => option.id === selectedId) || {};
        return (
            <Badge {...props} {...selectedOption}>
                {selectedOption.text}
            </Badge>
        );
    }

    return (
        <BadgeSelect {...props}/>
    );
};