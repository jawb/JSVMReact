/* @flow */

import ActionTypes from 'app/data/constants/ActionTypes'
import parse from 'app/data/vm/parser'


export const exec = () => ({ type: ActionTypes.EXEC_NEXT })

export const terminalFinishedReading = (str: string) => ({ type: ActionTypes.TERMINAL_FINISHED_READING, str })

export const reportError = (errorMsg: string) => ({ type: ActionTypes.DISPLAY_ERROR, errorMsg })

export const loadingStarted = () => ({ type: ActionTypes.LOADING_STARTED })

const displayError = (errorMsg) => ({ type: ActionTypes.DISPLAY_ERROR, errorMsg })
const parsingFinished = (code) => ({ type: ActionTypes.PARSING_FINISHED, code })

export const loadingFinished = (text: string) => {
    const result = parse(text)
    return result.isError() ? displayError(result.unwrap()) : parsingFinished(result.unwrap())
}

export const stopExecuter = () => ({ type: ActionTypes.EXECUTER_STOP })

export const startExecuter = () => (dispatch: Function) => {
    dispatch(stopExecuter())
    dispatch({ type: ActionTypes.EXECUTER_START })
}

export const startFastExecuter = () => (dispatch: Function) => {
    dispatch(stopExecuter())
    dispatch({ type: ActionTypes.FAST_EXECUTER_START })
}

export const resetVM = () => (dispatch: Function) => {
    dispatch(stopExecuter())
    dispatch({ type: ActionTypes.RESET_VM })
}

export const readData = (str: string) => (dispatch: Function) => {
    dispatch(terminalFinishedReading(str))
    dispatch(exec())
}
