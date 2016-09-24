/* @flow */

import {combineReducers} from 'redux'
import vm from 'app/data/reducers/vm'
import ui from 'app/data/reducers/ui'


const rootReducer = combineReducers({
    vm,
    ui
})

export default rootReducer
