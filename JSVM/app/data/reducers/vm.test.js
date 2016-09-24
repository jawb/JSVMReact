import vmReducer from 'app/data/reducers/vm'
import ActionTypes  from 'app/data/constants/ActionTypes'
import LineTypes from 'app/data/constants/LineTypes'

const {LABEL, OP} = LineTypes

describe('data', () => {
    describe('vm reducer', () => {

        const vm0 = vmReducer(undefined, {type: 'NONE'});
        test('should return empty VM as first state', () => {
            expect(vm0).toEqual({
                code       : [],
                stack      : [],
                symbolTable: {},
                labels     : {},
                stdout     : "",
                stdin      : "",
                reading    : false,
                pc         : 0
            })
        })

        const code = [
            { type: LABEL, arg: 'Begin' },
            { type: OP, op: 'PUSH', arg: 5 },
            { type: OP, op: 'READ', arg: undefined }
        ]
        const vm1 = vmReducer(vm0, {type: ActionTypes.PARSING_FINISHED, code});

        test('should return VM with loaded code and labels', () => {
            expect(vm1).toEqual({
                code       : code,
                stack      : [],
                symbolTable: {},
                labels     : {Begin: 0},
                stdout     : "",
                stdin      : "",
                reading    : false,
                pc         : 0
            })
        })

        const vm2 = vmReducer(vm1, {type: ActionTypes.EXEC_NEXT});
        const vm3 = vmReducer(vm2, {type: ActionTypes.EXEC_NEXT});
        test('should be able to call next, 5 pushed to stack, pc is 2', () => {
            expect(vm3).toEqual({
                code       : code,
                stack      : [5],
                symbolTable: {},
                labels     : {Begin: 0},
                stdout     : "",
                stdin      : "",
                reading    : false,
                pc         : 2
            })
        })

        const vm4 = vmReducer(vm3, {type: ActionTypes.EXEC_NEXT});
        test('should be able to call next, reading true', () => {
            expect(vm4).toEqual({
                code       : code,
                stack      : [5],
                symbolTable: {},
                labels     : {Begin: 0},
                stdout     : "",
                stdin      : "",
                reading    : true,
                pc         : 2
            })
        })

        const vm5 = vmReducer(vm4, {type: ActionTypes.EXEC_NEXT});
        test('should not be able to call next, reading true', () => {
            expect(vm5).toEqual(vm4)
        })

        const vm6 = vmReducer(vm5, {type: ActionTypes.TERMINAL_FINISHED_READING, str: '12'});
        test('should be able to call next, reading false, 12 added to stdin and stdout', () => {
            expect(vm6).toEqual({
                code       : code,
                stack      : [5],
                symbolTable: {},
                labels     : {Begin: 0},
                stdout     : '12',
                stdin      : '12',
                reading    : false,
                pc         : 2
            })
        })

        const vm7 = vmReducer(vm6, {type: ActionTypes.EXEC_NEXT});
        test('should be able to call next, 12 read from stdin and pushed to stack', () => {
            expect(vm7).toEqual({
                code       : code,
                stack      : [5, 12],
                symbolTable: {},
                labels     : {Begin: 0},
                stdout     : '12',
                stdin      : '',
                reading    : false,
                pc         : 3
            })
        })

        const vm8 = vmReducer(vm7, {type: ActionTypes.EXEC_NEXT});
        test('should not be able to call next, pc reached the end', () => {
            expect(vm8).toEqual(vm7)
        })
    })
})
