import React from 'react';
import {st, classes} from './app.st.css';
import {Main} from './views/main';

export interface AppProps {
    className?: string;
}

export const App: React.FC<AppProps> = ({className}) => {
    return (
        <main className={st(classes.root, className)}>
            <Main/>
        </main>
    );
};
