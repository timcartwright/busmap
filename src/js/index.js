import '../scss/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';

import reducers from './reducers';
import Main from './Main';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const store = createStoreWithMiddleware(reducers);

const body = (
  <Provider store={store}>
    <AppContainer>
      <Main />
    </AppContainer>
  </Provider>
);

let element = document.getElementById('content');
ReactDOM.render(body, element);

document.body.classList.remove('loading');

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Main', () => {
    const NextApp = require('./Main').default;
    ReactDOM.render(
      <Provider store={store}>
        <AppContainer>
          <NextApp/>
        </AppContainer>
      </Provider>,
      element
    );
  });
}
