import {createVM} from 'app/data/vm/vm'
import {getUI, isLoading, getErrorMessage,
        getVM, getCode, getCodeLines, getPC, isReading,
        getStdOut, getStdOutChars, getStdIn, getST,
        getStack, getLabels, mapTableSymbol, isLabel, getArg,
        getOp, getStateVM, getStateUI} from 'app/data/reducers/selectors'


const code = [
    { type: 'OP', op: 'PUSH', arg: 5 },
    { type: 'OP', op: 'READ', arg: undefined }
]

const vm = createVM(
        code,
        [1, 2, 3],
        {x: 1, y: 2},
        {Begin: 0},
        'stdout',
        'stdin',
        true,
        12
    )

const ui = {
    loading: true,
    errorMsg: "Error !"
}

const state = { vm, ui }

describe('data', () => {
    describe('selectors', () => {

        test('should return UI from state', () =>
            expect(getUI(state)).toEqual(ui))

        test('should return if UI is loading from state', () =>
            expect(isLoading(ui)).toEqual(true))

        test('should return error message from state', () =>
            expect(getErrorMessage(ui)).toEqual("Error !"))

        test('should return VM from state', () => expect(getVM(state)).toEqual(vm))

        test('should return VM code from state', () => expect(getCode(vm)).toEqual(code))

        test('should return VM code length from state', () =>
            expect(getCodeLines(vm)).toEqual(2))

        test('should return VM pc from state', () => expect(getPC(vm)).toEqual(12))

        test('should return if VM is reading from state', () =>
            expect(isReading(vm)).toEqual(true))

        test('should return VM stdout from state', () =>
            expect(getStdOut(vm)).toEqual('stdout'))

        test('should return VM stdout chars from state', () =>
            expect(getStdOutChars(vm)).toEqual('stdout'.split('')))

        test('should return VM stdin from state', () =>
            expect(getStdIn(vm)).toEqual('stdin'))

        test('should return VM stack from state', () =>
            expect(getStack(vm)).toEqual([1, 2, 3]))

        test('should return VM symbol table from state', () =>
            expect(getST(vm)).toEqual({x: 1, y: 2}))

        test('should return VM labels from state', () =>
            expect(getLabels(vm)).toEqual({Begin: 0}))

        test('should return VM labels from state', () =>
            expect(mapTableSymbol(vm, (k, v, i) => [k, v, i])).toEqual([["x",1,0],["y",2,1]]))

        const [line, ...rest] = code
        test('should return if line is a label', () => expect(isLabel(line)).toEqual(false))
        test('should return argument from line', () => expect(getArg(line)).toEqual(5))
        test('should return op from line', () => expect(getOp(line)).toEqual('PUSH'))

        test('should return VM from state', () =>
            expect(getStateVM(state)).toEqual({vm}))

        test('should return UI from state', () =>
            expect(getStateUI(state)).toEqual({ui}))
    })
})
