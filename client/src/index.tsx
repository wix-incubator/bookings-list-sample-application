import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './app';
import {Provider} from 'mobx-react';
import stores from './store';

import './base.st.css';

const container = document.body.appendChild(document.createElement('div'));

ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <App/>
        </Provider>
    </React.StrictMode>,
    container
);
