import React from 'react';
import {st, classes} from './App.st.css';
import Main from './views/Main';

export const App = ({className}) => {
    return (
        <main className={st(classes.root, className)}>
            <Main/>
        </main>
    );
};
