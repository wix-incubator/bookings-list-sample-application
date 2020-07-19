import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {Provider} from 'mobx-react';
import stores from './store';

import './base.st.css';

const container = document.body.appendChild(document.createElement('div'));

ReactDOM.render(
    <>
        <Provider {...stores}>
            <App/>
        </Provider>
    </>,
    container
);
