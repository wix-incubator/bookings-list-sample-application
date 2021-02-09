import React from 'react';
import {Button} from 'wix-style-react';
import axiosInstance from '../../../network';

export default class MicrosoftConnect extends React.Component {

    _makeRequest = async () => {
        const result = await axiosInstance.get('microsoft-auth');
        window.location.replace(result.data);
    };

    render() {
        return (
            <Button onClick={this._makeRequest}>Microsoft</Button>
        );
    }
}
