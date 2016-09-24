/* @flow */

import {Result, Error} from 'app/data/func'

type Map<K, V> = {[key:K]: V};
type MapStrNum = Map<string, number>;


type Line = {
    type: string;
    arg: any;
    op: string;
}

type Code = Array<Line>;

type VM = {
    code: Code;
    stack: Array<number>;
    symbolTable: MapStrNum;
    labels: MapStrNum;
    stdout: string;
    stdin: string;
    reading: boolean;
    pc: number;
}

type UI = {
    loading: boolean;
    errorMsg: string;
}

type State = {
    vm: VM;
    ui: UI;
}

type OpType = {
    opName: string;
    withArg: boolean;
    argType?: string;
}


declare interface ErrorResult {
    __value: any;
    constructor(x: any): Error | Result;
    static of(x: any) : Error | Result;
    isError() : boolean;
    unwrap() : any;
    map(f: Function) : Error | Result;
    acc(x: Error | Result) : Error | Result;
}

type Action = {
    type: string;
}
