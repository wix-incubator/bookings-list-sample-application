import React from 'react';
import './network';
import ReactDOM from 'react-dom';
import {App} from './App';
import {Provider} from 'mobx-react';
import mobxRoot from './store';
import {I18nextProvider} from 'react-i18next';
import i18n from './locales';
import 'mobx-react-lite/batchingForReactDom'; // https://github.com/mobxjs/mobx-react-lite/#observer-batching

import './base.st.css';

const container = document.body.appendChild(document.createElement('div'));

ReactDOM.render(
  <>
    <I18nextProvider i18n={i18n}>
      <Provider mobxRoot={mobxRoot} {...mobxRoot}>
        <App/>
      </Provider>
    </I18nextProvider>
  </>,
  container
);
