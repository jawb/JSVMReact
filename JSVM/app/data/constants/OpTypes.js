/* @flow */

import ArgTypes from 'app/data/constants/ArgTypes'


const OpTypes: Map<string, OpType> = {
    DATA: {opName: "DATA", withArg: true, argType: ArgTypes.STR},
    LOAD: {opName: "LOAD", withArg: true, argType: ArgTypes.STR},
    STORE: {opName: "STORE", withArg: true, argType: ArgTypes.STR},
    PUSH: {opName: "PUSH", withArg: true, argType: ArgTypes.NUMERIC},
    POP: {opName: "POP", withArg: false},
    DUPLICATE: {opName: "DUPLICATE", withArg: false},

    ADD: {opName: "ADD", withArg: false},
    SUB: {opName: "SUB", withArg: false},
    MULT: {opName: "MULT", withArg: false},
    DIV: {opName: "DIV", withArg: false},
    MOD: {opName: "MOD", withArg: false},
    AND: {opName: "AND", withArg: false},
    OR: {opName: "OR", withArg: false},
    XOR: {opName: "XOR", withArg: false},
    NOT: {opName: "NOT", withArg: false},
    RAS: {opName: "RAS", withArg: true, argType: ArgTypes.NUMERIC},
    RBS: {opName: "RBS", withArg: true, argType: ArgTypes.NUMERIC},
    LS: {opName: "LS", withArg: true, argType: ArgTypes.NUMERIC},
    LT: {opName: "LT", withArg: false},
    LE: {opName: "LE", withArg: false},

    JMP: {opName: "JMP", withArg: true, argType: ArgTypes.STR},
    BEQ: {opName: "BEQ", withArg: true, argType: ArgTypes.STR},
    BNE: {opName: "BNE", withArg: true, argType: ArgTypes.STR},

    PRINT: {opName: "PRINT", withArg: false},
    PRINTC: {opName: "PRINTC", withArg: false},
    PRINTSTR: {opName: "PRINTSTR", withArg: false},
    READ: {opName: "READ", withArg: false},
    READC: {opName: "READC", withArg: false},
    READSTR: {opName: "READSTR", withArg: false},
}

export default OpTypes;
