/* @flow */

import LineTypes from 'app/data/constants/LineTypes'
import {to32Float, charTo32Float} from 'app/data/utils'

const {LABEL} = LineTypes

export const createVM = (
        code: Code = [],
        stack: Array<number> = [],
        symbolTable: MapStrNum = {},
        labels: MapStrNum = {},
        stdout: string = "",
        stdin: string = "",
        reading: boolean = false,
        pc: number = 0
    ) : VM => ({ code, stack, symbolTable, labels, stdout, stdin, reading, pc })

export const hasNext = (vm: VM) : boolean => (vm.code.length > 0 && vm.pc < vm.code.length)

export const nextCmd = (vm: VM) : Line => vm.code[vm.pc]

export const isReading = (vm: VM) : boolean => vm.reading

export const pushCode = (vm: VM, code: Code) : VM => {
    const labels = code.reduce((p, x, i) => {
        if (x.type === LABEL) p[x.arg] = i
        return p
    }, {})
    return {...vm, code, labels, pc: 0}
}

export const applyFuncBinary = (vm: VM, func: (a: number, b: number) => number) : VM => {
    const stack = [...vm.stack]
    const a = stack.pop()
    const b = stack.pop()
    stack.push(func(a, b))
    return {...vm, pc: vm.pc + 1, stack}
}

export const applyFuncUnary = (vm: VM, func: (x: number) => number) : VM => {
    const stack = [...vm.stack]
    const a = stack.pop()
    stack.push(func(a))
    return {...vm, pc: vm.pc + 1, stack}
}

export const nextVM = (vm: VM) : VM => {

    if (!hasNext(vm)) return vm;

    const cmd = nextCmd(vm)

    switch (cmd.op) {

        case "DATA": {
            const {arg} = cmd
            const symbolTable = {...vm.symbolTable, [arg]: 0}
            return {...vm, pc: vm.pc + 1, symbolTable}
        }

        case "LOAD": {
            const {arg} = cmd
            const value = vm.symbolTable[arg]
            const stack = [...vm.stack, value]
            return {...vm, pc: vm.pc + 1, stack}
        }

        case "STORE": {
            const {arg} = cmd
            const stack = [...vm.stack]
            const top = stack.pop()
            const symbolTable = {...vm.symbolTable, [arg]: top}
            return {...vm, pc: vm.pc + 1, stack, symbolTable}
        }

        case "PUSH": {
            const {arg} = cmd
            const stack = [...vm.stack, arg]
            return {...vm, pc: vm.pc + 1, stack}
        }

        case "POP": {
            const stack = [...vm.stack]
            stack.pop()
            return {...vm, pc: vm.pc + 1, stack}
        }

        case "DUPLICATE": {
            const stack = [...vm.stack]
            const top = stack.pop()
            stack.push(top)
            stack.push(top)
            return {...vm, pc: vm.pc + 1, stack}
        }

        case "ADD": {
            return applyFuncBinary(vm, (a, b) => a + b);
        }

        case "SUB": {
            return applyFuncBinary(vm, (a, b) => a - b);
        }

        case "MULT": {
            return applyFuncBinary(vm, (a, b) => a * b);
        }

        case "DIV": {
            return applyFuncBinary(vm, (a, b) => a / b);
        }

        case "MOD": {
            return applyFuncBinary(vm, (a, b) => a % b);
        }

        case "AND": {
            return applyFuncBinary(vm, (a, b) => a & b);
        }

        case "OR": {
            return applyFuncBinary(vm, (a, b) => a | b);
        }

        case "XOR": {
            return applyFuncBinary(vm, (a, b) => a ^ b);
        }

        case "NOT": {
            return applyFuncUnary(vm, (a) => ~a);
        }

        case "RAS": {
            const {arg} = cmd
            return applyFuncUnary(vm, (a) => a >>= arg);
        }

        case "RBS": {
            const {arg} = cmd
            return applyFuncUnary(vm, (a) => a >>>= arg);
        }

        case "LS":{
            const {arg} = cmd
            return applyFuncUnary(vm, (a) => a <<= arg);
        }

        case "LT": {
            return applyFuncBinary(vm, (a, b) => (a < b) + 0);
        }

        case "LE": {
            return applyFuncBinary(vm, (a, b) => (a <= b) + 0);
        }

        case "JMP": {
            const {arg} = cmd
            const pc =  vm.labels[arg]
            return pc ? {...vm, pc} : {...vm, pc: vm.pc + 1}
        }

        case "BEQ": {
            const stack = [...vm.stack]
            const {arg} = cmd
            const value = stack.pop()
            const pc =  vm.labels[arg]
            return (value === 0 && pc) ? {...vm, stack, pc} : {...vm, stack, pc: vm.pc + 1}
        }

        case "BNE": {
            const stack = [...vm.stack]
            const {arg} = cmd
            const value = stack.pop()
            const pc =  vm.labels[arg]
            return (value === 1 && pc) ? {...vm, stack, pc} : {...vm, stack, pc: vm.pc + 1}
        }

        case "PRINT": {
            const stack = [...vm.stack]
            const value = stack.pop()
            const stdout = vm.stdout + value
            return {...vm, pc: vm.pc + 1, stack, stdout}
        }

        case "PRINTC": {
            const stack = [...vm.stack]
            const value = stack.pop()
            const stdout = vm.stdout + String.fromCharCode(value);
            return {...vm, pc: vm.pc + 1, stack, stdout}
        }

        case "PRINTSTR": {
            const stack = [...vm.stack]
            let str = "", c;
            while ((c = stack.pop()) !== 0 && c !== undefined) {
                str += String.fromCharCode(c)
            }
            const stdout = vm.stdout + str
            return {...vm, pc: vm.pc + 1, stack, stdout}
        }

        case "READ": {
            if (vm.stdin.length === 0) return {...vm, reading: true}

            const stack = [...vm.stack]
            const stdinArr = vm.stdin.split('')
            const zeroindex = stdinArr.findIndex(x => x === "\0")
            const index = zeroindex === -1 ? stdinArr.length : zeroindex
            const readStr = stdinArr.slice(0, index).join('')
            const stdin = stdinArr.slice(index + 1).join('')

            if (readStr.length > 0) {
                stack.push(to32Float(parseFloat(readStr, 10)))
            }

            return {...vm, pc: vm.pc + 1, stack, stdin}
        }

        case "READC": {
            if (vm.stdin.length === 0) return {...vm, reading: true}

            const stack = [...vm.stack]
            const stdinArr = vm.stdin.split('')
            const char = stdinArr.pop()
            if (char) stack.push(charTo32Float(char))
            const stdin = stdinArr.join('')
            return {...vm, pc: vm.pc + 1, stack, stdin}
        }

        case "READSTR": {
            if (vm.stdin.length === 0) return {...vm, reading: true}

            const stack = [...vm.stack]
            const stdinArr = vm.stdin.split('')
            const zeroindex = stdinArr.findIndex(x => x === "\0")
            const index = zeroindex === -1 ? stdinArr.length : zeroindex
            const readStr = stdinArr.slice(0, index).reverse()
            const stdin = stdinArr.slice(index + 1).join('')

            if (readStr.length > 0) {
                stack.push(0)
                readStr.forEach(x => stack.push(charTo32Float(x)))
            }

            return {...vm, pc: vm.pc + 1, stack, stdin}
        }

        default:
            return {...vm, pc: vm.pc + 1}
    }
}
