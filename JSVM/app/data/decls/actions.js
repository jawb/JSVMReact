/* @flow */


type Action_LOADING_STARTED = { type: 'LOADING_STARTED' }
type Action_LOADING_FINISHED = { type: 'LOADING_FINISHED' }
type Action_DISPLAY_ERROR = { type: 'DISPLAY_ERROR', errorMsg: string }
type UIStoreActions = Action_LOADING_STARTED | Action_LOADING_FINISHED | Action_DISPLAY_ERROR

type Action_PARSING_FINISHED = { type: 'PARSING_FINISHED', code: Code }
type Action_EXEC_NEXT = { type: 'EXEC_NEXT' }
type Action_TERMINAL_FINISHED_READING = { type: 'TERMINAL_FINISHED_READING', str: string }
type VMStoreActions = Action_PARSING_FINISHED | Action_EXEC_NEXT | Action_TERMINAL_FINISHED_READING
