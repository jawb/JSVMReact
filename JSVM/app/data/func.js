/* @flow */


export class Error {
    __value: any

    constructor(x: any) {
        this.__value = x
    }

    static of = (x: any) : Error => {
        return new Error(x)
    }

    isError = () : boolean => true

    unwrap = () : any => this.__value

    map = (f: Function) : Error => {
        return this
    }

    acc = (x: Error | Result) : Error | Result => {
        return this
    }
}

export class Result {
    __value: any

    constructor(x: any) {
        this.__value = x
    }

    static of = (x: any) : Result => {
        return new Result(x)
    }

    isError = () : boolean => false

    unwrap = () : any => this.__value

    map = (f: Function) : any => {
        return f(this.__value)
    }

    acc = (x: Error | Result) : Error | Result => {
        if (x instanceof Result) {
            return Result.of([...this.__value, x.__value])
        }
        return x
    }
}
