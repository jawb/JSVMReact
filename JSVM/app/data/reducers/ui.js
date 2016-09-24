/* @flow */

import ActionTypes  from 'app/data/constants/ActionTypes'


const initialState: UI = {
    loading: false,
    errorMsg: ""
}


export default (state: UI = initialState, action: UIStoreActions) => {

  switch (action.type) {

    case ActionTypes.LOADING_STARTED: {
        return {...state, loading: true, errorMsg: ""}
    }

    case ActionTypes.PARSING_FINISHED: {
        return {...state, loading: false, errorMsg: ""}
    }

    case ActionTypes.DISPLAY_ERROR: {
        const {errorMsg} = action
        return {...state, errorMsg}
    }

    default:
        return state
  }
}
