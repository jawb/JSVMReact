/* @flow */

import ActionTypes  from 'app/data/constants/ActionTypes'
import {hasNext, isReading, createVM, nextVM, pushCode} from 'app/data/vm/vm'


const initialState: VM = createVM()

export default (state: VM = initialState, action: VMStoreActions) => {

  switch (action.type) {

    case ActionTypes.PARSING_FINISHED: {
        const {code} = action
        return pushCode(initialState, code)
    }

    case ActionTypes.EXEC_NEXT: {
        const vm = state
        if (hasNext(vm) && !isReading(vm)) {
            return nextVM(vm)
        }
        return vm
    }

    case ActionTypes.TERMINAL_FINISHED_READING: {
        const {str} = action
        const stdout = state.stdout + str
        const stdin  = state.stdin + str
        return {...state, reading: false, stdin, stdout}
    }

    case ActionTypes.RESET_VM: {
        return initialState
    }

    default:
        return state
  }
}
