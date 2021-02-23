import React from 'react';
import {Button} from 'wix-style-react';
import axiosInstance from '../../../network';

export default class SyncCalendar extends React.Component {

    _makeRequest = async () => {
        try {
            const result = await axiosInstance.post('sync-event');
            console.log(result.data);
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        return (
            <Button onClick={this._makeRequest}>Sync</Button>
        );
    }
}
