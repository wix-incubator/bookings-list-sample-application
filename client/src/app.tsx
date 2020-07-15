import React from 'react';
import {st, classes} from './app.st.css';
import {Header} from './header';
import {Main} from './views/main';

console.log({classes})
export interface AppProps {
    className?: string;
}

export const App: React.FC<AppProps> = ({className}) => {
    return (
        <main className={st(classes.root, className)}>
            <Header className={classes.header}/>
            <Main/>
        </main>
    );
};
