import React, {useEffect} from 'react';
import {st, classes} from './App.st.css';
import Main from './views/Main';
import {setWixInstanceId} from './utils';

export const App = ({className}) => {
    useEffect(() => {
        setWixInstanceId();
    }, []);

    return (
        <main className={st(classes.root, className)}>
            <Main/>
        </main>
    );
};
