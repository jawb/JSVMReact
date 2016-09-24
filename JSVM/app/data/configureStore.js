import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from 'app/data/reducers'


export default function configureStore(initialState) {

    const loggerMiddleware = createLogger()

    const sagaMiddleware = createSagaMiddleware()

    const createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        sagaMiddleware
    )(createStore)
    const store = createStoreWithMiddleware(rootReducer, initialState)

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./reducers')
            store.replaceReducer(nextReducer)
        })
    }

    return {store, sagaMiddleware}
}
