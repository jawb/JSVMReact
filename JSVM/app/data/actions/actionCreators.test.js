import ActionTypes from 'app/data/constants/ActionTypes'
import LineTypes from 'app/data/constants/LineTypes'
import * as actions from 'app/data/actions/actionCreators'
import {createVM} from 'app/data/vm/vm'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const {LABEL, OP} = LineTypes

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)


describe('data', () => {
    describe('actions', () => {

        test('parse valid code and dispatche PARSING_FINISHED with opcode', () => {
            expect(actions.loadingFinished('\nBegin:\n  \nPUSH 5\n  \nPOP\n')).toEqual({
                type: ActionTypes.PARSING_FINISHED,
                code: [
                    { type: LABEL, arg: 'Begin' },
                    { type: OP, op: 'PUSH', arg: 5 },
                    { type: OP, op: 'POP', arg: undefined }
                ]
            })
        })

        test('parse unvalid code and dispatche DISPLAY_ERROR with error message', () => {
            expect(actions.loadingFinished('\nBegin:\n  \nPUSH 5\nNO_OP\nPOP\n')).toEqual({
                type: ActionTypes.DISPLAY_ERROR,
                errorMsg: 'Undefined operation NO_OP'
            })
        })

        test('startExecuter should dispatch EXECUTER_STOP then EXECUTER_START', (done) => {
            const expectedActions = [
                { type: ActionTypes.EXECUTER_STOP },
                { type: ActionTypes.EXECUTER_START }
            ]
            const store = mockStore({}, expectedActions, done)
            store.dispatch(actions.startExecuter())
        })

        test('startFastExecuter should dispatch EXECUTER_STOP then FAST_EXECUTER_START', (done) => {
            const expectedActions = [
                { type: ActionTypes.EXECUTER_STOP },
                { type: ActionTypes.FAST_EXECUTER_START }
            ]
            const store = mockStore({}, expectedActions, done)
            store.dispatch(actions.startFastExecuter())
        })

        test('resetVM should dispatch EXECUTER_STOP then RESET_VM', (done) => {
            const expectedActions = [
                { type: ActionTypes.EXECUTER_STOP },
                { type: ActionTypes.RESET_VM }
            ]
            const store = mockStore({}, expectedActions, done)
            store.dispatch(actions.resetVM())
        })

        test('readData should dispatch TERMINAL_FINISHED_READING then EXEC_NEXT', (done) => {
            const str = "string from stdin"
            const expectedActions = [
                { type: ActionTypes.TERMINAL_FINISHED_READING, str },
                { type: ActionTypes.EXEC_NEXT }
            ]
            const store = mockStore({}, expectedActions, done)
            store.dispatch(actions.readData(str))
        })
    })
})
