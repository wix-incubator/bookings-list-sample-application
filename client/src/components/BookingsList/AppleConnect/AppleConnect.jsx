import React from 'react';
import {Button} from 'wix-style-react';

export default class AppleConnect extends React.Component {

    render() {

        return (
            <>
                <Button onClick={() => console.log("iCloud clicked")}>iCloud</Button>
            </>
        );
    }
}
