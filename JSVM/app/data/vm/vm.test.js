import LineTypes from 'app/data/constants/LineTypes'
import {createVM, hasNext, nextCmd, isReading, pushCode, applyFuncBinary, applyFuncUnary, nextVM} from 'app/data/vm/vm'

const {LABEL, OP} = LineTypes

describe('data', () => {
    describe('vm', () => {
        
        test('should create empty VM', () => {
            expect(createVM()).toEqual({
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

        test('should check if VM can run next', () => {
            const vm1 = createVM()
            expect(hasNext(vm1)).toEqual(false)

            const vm2 = {...vm1, code: [0, 1, 2], pc: 1}
            expect(hasNext(vm2)).toEqual(true)

            const vm3 = {...vm2, pc: 3}
            expect(hasNext(vm3)).toEqual(false)
        })

        test('should return next op in VM', () => {
            const vm1 = createVM([2, 3, 4])
            expect(nextCmd(vm1)).toEqual(2)
            const vm2 = {...vm1, pc: 1}
            expect(nextCmd(vm2)).toEqual(3)
        })

        test('should return labels from code', () => {
            const vm = createVM()
            const code = [
                { type: LABEL, arg: 'Begin' },
                { type: OP, op: 'PUSH', arg: 5 },
                { type: OP, op: 'POP', arg: undefined },
                { type: LABEL, arg: 'End' },
            ]
            const newVm = pushCode(vm, code)
            expect(newVm.code).toEqual(code)
            expect(newVm.labels).toEqual({Begin: 0, End: 3})
            expect(newVm.pc).toEqual(0)
        })

        test('should sum first two numbers in stack', () => {
            const vm = createVM()
            const newVm = applyFuncBinary({...vm, stack: [4, 5, 1, 2]}, (a,b) => a+b)
            expect(newVm.stack).toEqual([4, 5, 3])
            expect(newVm.pc).toEqual(1)
        })

        test('should switch sign of the first number in stack', () => {
            const vm = createVM()
            const newVm = applyFuncUnary({...vm, stack: [4, 5, 1, 2]}, a => -a)
            expect(newVm.stack).toEqual([4, 5, 1, -2])
            expect(newVm.pc).toEqual(1)
        })

        test('should add symbol to symbol table', () => {
            const vm = createVM([{type: OP, op: 'DATA', arg: 'x'}])
            const newVm = nextVM(vm)
            expect(newVm.symbolTable).toEqual({x: 0})
            expect(newVm.pc).toEqual(1)
        })

        test('should load symbol from symbol table to stack', () => {
            const vm = createVM([{type: OP, op: 'LOAD', arg: 'x'}], [], {x: 10})
            const newVm = nextVM(vm)
            expect(newVm.stack).toEqual([10])
            expect(newVm.pc).toEqual(1)
        })

        test('should pop from stack and store symbol in symbol table', () => {
            const vm = createVM([{type: OP, op: 'STORE', arg: 'x'}], [10])
            const newVm = nextVM(vm)
            expect(newVm.symbolTable).toEqual({x: 10})
            expect(newVm.stack).toEqual([])
            expect(newVm.pc).toEqual(1)
        })

        test('should push to stack', () => {
            const vm = createVM([{type: OP, op: 'PUSH', arg: 10}])
            const newVm = nextVM(vm)
            expect(newVm.stack).toEqual([10])
            expect(newVm.pc).toEqual(1)
        })

        test('should pop from stack', () => {
            const vm = createVM([{type: OP, op: 'POP'}], [10, 11])
            const newVm = nextVM(vm)
            expect(newVm.stack).toEqual([10])
            expect(newVm.pc).toEqual(1)
        })

        test('should duplicate stack head', () => {
            const vm = createVM([{type: OP, op: 'DUPLICATE'}], [10, 11])
            const newVm = nextVM(vm)
            expect(newVm.stack).toEqual([10, 11, 11])
            expect(newVm.pc).toEqual(1)
        })

        test('should move program counter to label if found, else skip', () => {
            const vm1 = createVM([{type: OP, op: 'JMP', arg: 'Begin'}], [], {}, {Begin: 10})
            const newVm1 = nextVM(vm1)
            expect(newVm1.pc).toEqual(10)

            const vm2 = createVM([{type: OP, op: 'JMP', arg: 'Begin'}])
            const newVm2 = nextVM(vm2)
            expect(newVm2.pc).toEqual(1)
        })

        test('should jump if stack top is 0', () => {
            const vm1 = createVM([{type: OP, op: 'BEQ', arg: 'Begin'}], [0], {}, {Begin: 10})
            const newVm1 = nextVM(vm1)
            expect(newVm1.pc).toEqual(10)
            expect(newVm1.stack).toEqual([])

            const vm2 = createVM([{type: OP, op: 'BEQ', arg: 'Begin'}], [0])
            const newVm2 = nextVM(vm2)
            expect(newVm2.pc).toEqual(1)
            expect(newVm2.stack).toEqual([])

            const vm3 = createVM([{type: OP, op: 'BEQ', arg: 'Begin'}], [1])
            const newVm3 = nextVM(vm3)
            expect(newVm3.pc).toEqual(1)
            expect(newVm3.stack).toEqual([])
        })

        test('should jump if stack top is 1', () => {
            const vm1 = createVM([{type: OP, op: 'BNE', arg: 'Begin'}], [1], {}, {Begin: 10})
            const newVm1 = nextVM(vm1)
            expect(newVm1.pc).toEqual(10)
            expect(newVm1.stack).toEqual([])

            const vm2 = createVM([{type: OP, op: 'BNE', arg: 'Begin'}], [1])
            const newVm2 = nextVM(vm2)
            expect(newVm2.pc).toEqual(1)
            expect(newVm2.stack).toEqual([])

            const vm3 = createVM([{type: OP, op: 'BNE', arg: 'Begin'}], [0])
            const newVm3 = nextVM(vm3)
            expect(newVm3.pc).toEqual(1)
            expect(newVm3.stack).toEqual([])
        })

        test('should print as number', () => {
            const vm = createVM([{type: OP, op: 'PRINT'}], [10])
            const newVm = nextVM(vm)
            expect(newVm.stack).toEqual([])
            expect(newVm.stdout).toEqual("10")
            expect(newVm.pc).toEqual(1)
        })

        test('should print as character', () => {
            const vm = createVM([{type: OP, op: 'PRINTC'}], [97])
            const newVm = nextVM(vm)
            expect(newVm.stack).toEqual([])
            expect(newVm.stdout).toEqual("a")
            expect(newVm.pc).toEqual(1)
        })

        test('should print characters until \\0 or stack is empty', () => {
            const vm1 = createVM([{type: OP, op: 'PRINTSTR'}], [97, 98, 99, 100])
            const newVm1 = nextVM(vm1)
            expect(newVm1.stack).toEqual([])
            expect(newVm1.stdout).toEqual("dcba")
            expect(newVm1.pc).toEqual(1)

            const vm2 = createVM([{type: OP, op: 'PRINTSTR'}], [101, 0, 97, 98, 99, 100])
            const newVm2 = nextVM(vm2)
            expect(newVm2.stack).toEqual([101])
            expect(newVm2.stdout).toEqual("dcba")
            expect(newVm2.pc).toEqual(1)
        })

        test('should read number from stdin till \\0 or length, set reading flag if empty stdin', () => {
            const vm1 = createVM([{type: OP, op: 'READ'}], [], {}, {}, "", '12.34\0'+'12')
            const newVm1 = nextVM(vm1)
            expect(newVm1.stack[0] - 12.34 < 1e-6).toEqual(true)
            expect(newVm1.pc).toEqual(1)

            const vm2 = createVM([{type: OP, op: 'READ'}], [], {}, {}, "", "12.34")
            const newVm2 = nextVM(vm2)
            expect(newVm2.stack[0] - 12.34 < 1e-6).toEqual(true)
            expect(newVm2.pc).toEqual(1)

            const vm3 = createVM([{type: OP, op: 'READ'}])
            const newVm3 = nextVM(vm3)
            expect(newVm3.reading).toEqual(true)
            expect(newVm3.stack).toEqual([])
            expect(newVm3.pc).toEqual(0)
        })

        test('should read character from stdin, set reading flag if empty stdin', () => {
            const vm1 = createVM([{type: OP, op: 'READC'}], [], {}, {}, "", 'a')
            const newVm1 = nextVM(vm1)
            expect(newVm1.stack).toEqual([97])
            expect(newVm1.pc).toEqual(1)

            const vm2 = createVM([{type: OP, op: 'READC'}])
            const newVm2 = nextVM(vm2)
            expect(newVm2.reading).toEqual(true)
            expect(newVm2.stack).toEqual([])
            expect(newVm2.pc).toEqual(0)
        })

        test('should read string from stdin till \\0 or length, set reading flag if empty stdin', () => {
            const vm1 = createVM([{type: OP, op: 'READSTR'}], [], {}, {}, "", 'hello\0world')
            const newVm1 = nextVM(vm1)
            expect(newVm1.stack).toEqual([0, 111, 108, 108, 101, 104])
            expect(newVm1.pc).toEqual(1)

            const vm2 = createVM([{type: OP, op: 'READSTR'}], [], {}, {}, "", 'hello')
            const newVm2 = nextVM(vm2)
            expect(newVm2.stack).toEqual([0, 111, 108, 108, 101, 104])
            expect(newVm2.pc).toEqual(1)

            const vm3 = createVM([{type: OP, op: 'READSTR'}])
            const newVm3 = nextVM(vm3)
            expect(newVm3.reading).toEqual(true)
            expect(newVm3.stack).toEqual([])
            expect(newVm3.pc).toEqual(0)
        })
    })
})
