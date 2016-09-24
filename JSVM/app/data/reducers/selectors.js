/* @flow */

import LineTypes from 'app/data/constants/LineTypes'

const {LABEL} = LineTypes;


// UI
export const getUI = (state: State) => state.ui
export const isLoading = (ui: UI) => ui.loading
export const getErrorMessage = (ui: UI) => ui.errorMsg


// VM
export const getVM = (state: State) => state.vm
export const getCode = (vm: VM) => vm.code
export const getCodeLines = (vm: VM) => getCode(vm).length
export const getPC = (vm: VM) => vm.pc
export const isReading = (vm: VM) => vm.reading
export const getStdOut = (vm: VM) => vm.stdout
export const getStdOutChars = (vm: VM) => getStdOut(vm).split('')
export const getStdIn = (vm: VM) => vm.stdin
export const getST = (vm: VM) => vm.symbolTable
export const getStack = (vm: VM) => vm.stack
export const getLabels = (vm: VM) => vm.labels
export const mapTableSymbol = (
    vm: VM,
    callback: (variable: string, value: number, i: number) => any
): any => {
    const symbolTable = getST(vm)
    return Object.keys(symbolTable).map((key, i) =>
        callback(key, symbolTable[key], i))
}


// Code
export const isLabel = (line: Line) => line.type === LABEL
export const getArg = (line: Line) => line.arg
export const getOp = (line: Line) => line.op

// Connect selectors
export const getStateVM = (state: State) => ({vm: getVM(state)})
export const getStateUI = (state: State) => ({ui: getUI(state)})
