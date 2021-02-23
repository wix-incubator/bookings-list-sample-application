import React from 'react';
import {Button} from 'wix-style-react';
import axiosInstance from '../../../network';

export default class OutlookConnect extends React.Component {

    _makeRequest = async () => {
        const result = await axiosInstance.post('outlook-nylas-auth');
        console.log(result);
    };

    render() {
        return (
            <>
                <Button onClick={this._makeRequest}>Outlook</Button>
            </>
        );
    }
}
