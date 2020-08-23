import React from 'react';
import {st, classes} from './BadgeDropdown.st.css';
import {Badge, BadgeSelect} from 'wix-style-react';

export const BadgeDropdown = (props) => {
    const {disabled} = props;

    if (disabled) {
        const {options, selectedId} = props;
        const selectedOption = options.find(option => option.id === selectedId) || {};
        return (
            <Badge {...props}>
                {selectedOption.text}
            </Badge>
        );
    }

    return (
        <BadgeSelect {...props}/>
    );
};