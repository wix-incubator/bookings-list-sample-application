import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {Provider} from 'mobx-react';
import stores from './store';
import 'mobx-react-lite/batchingForReactDom'; // https://github.com/mobxjs/mobx-react-lite/#observer-batching

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
