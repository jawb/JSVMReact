import {actionChannel, call, take, put, race} from 'redux-saga/effects'
import ActionTypes from 'app/data/constants/ActionTypes'
import * as actions from 'app/data/actions/actionCreators'
import Promise from 'bluebird'


export const executerFactory = (starterAction, wait) => function* executer() {
    const channel = yield actionChannel(starterAction)

    while (yield take(channel)) {
        while (true) {
            const winner = yield race({
                stopped: take(ActionTypes.EXECUTER_STOP),
                tick: call(wait)
            })

            if (!winner.stopped) {
                yield put(actions.exec())
            } else break
        }
    }
}

const wait = ms => () => new Promise(resolve => setTimeout(() => resolve(), ms))
export const executer = executerFactory(ActionTypes.EXECUTER_START, wait(1000))
export const fastExecuter = executerFactory(ActionTypes.FAST_EXECUTER_START, wait(10))

export default function* rootExecuterSaga() {
    yield [ executer(), fastExecuter() ]
}
