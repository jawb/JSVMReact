import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import configureStore from 'app/data/configureStore'
import rootExecuterSaga from 'app/data/sagas/executer'

import { AppContainer } from 'react-hot-loader';

import Container from 'app/components/Container'


require('../res/less/main.less')

const {store, sagaMiddleware} = configureStore()

sagaMiddleware.run(rootExecuterSaga)


render(
    <AppContainer>
    <Provider store={store}>
        <Container />
    </Provider>
    </AppContainer>
, document.getElementById('react'));

if (module.hot) {
    module.hot.accept('app/components/Container', () => {
      const NextContainer = require('app/components/Container').default; // eslint-disable-line
      render(
        <AppContainer>
            <Provider store={store}>
                <NextContainer />
            </Provider>
        </AppContainer>,
        document.getElementById('react'));
    });
}
