import React from 'react';
import {Button} from 'wix-style-react';
import axiosInstance from '../../../network';

export default class AppleConnect extends React.Component {

    _makeRequest = async () => {
        const result = await axiosInstance.post('icloud-nylas-auth');
        console.log(result);
    };

    render() {
        return (
            <>
                <Button onClick={this._makeRequest}>iCloud</Button>
            </>
        );
    }
}
