import React, {useEffect} from 'react';
import {st, classes} from './App.st.css';
import Main from './views/Main';
import Wix from 'wix-sdk';

export const App = ({className}) => {
    useEffect(() => {
        try {
            window.sessionStorage.setItem('instanceId', Wix.Utils.getInstanceId());
        } catch (e) {
            console.log({e});
        }
    }, []);

    return (
        <main className={st(classes.root, className)}>
            <Main/>
        </main>
    );
};
