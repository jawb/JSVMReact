/* @flow */

import {to32Float} from 'app/data/utils'
import {Result, Error} from 'app/data/func'
import LineTypes from 'app/data/constants/LineTypes'
import OpTypes from 'app/data/constants/OpTypes'
import ArgTypes from 'app/data/constants/ArgTypes'

import flow from 'lodash/function/flow'
import curry from 'lodash/function/curry'

const {LABEL, OP} = LineTypes;


// Constants

const regex = /([a-zA-Z_0-9]*):/i

const ops: Array<string> = Object.keys(OpTypes)

const numericOps = ops.filter(x => OpTypes[x].argType === ArgTypes.NUMERIC)

const withArg = ops.filter(x => OpTypes[x].withArg)


// Functions

const map = curry((fn, x) => x.map(fn))

const filter = curry((fn, x) => x.filter(fn))

const reduce = curry((fn, init, x) => x.reduce(fn, init))

const split = curry((delimiter, str) => str.split(delimiter))

const splitIntoLines = split("\n")

// isNotEmpty :: String -> Bool
const isNotEmpty = (x: string) : boolean => x.trim(/\s+/).length !== 0

// filterEmptyLines :: [String] -> [String]
const filterEmptyLines = curry(filter)(isNotEmpty)

// isLabel :: String -> Bool
const isLabel = (line: string) : boolean => regex.test(line)

// getLabelName :: String -> String
const getLabelName = (line: string) : string => {
    const matches = line.match(regex);
    return matches ? (matches.length > 0 ? matches[1] : '') : ''
}

// getLabel :: String -> Result
const getLabel = (line: string) : Result => Result.of({ type: LABEL, arg: getLabelName(line) })

// isIn :: String, String -> Bool
const isIn = (ops: Array<string>, op: string) : boolean => ops.indexOf(op) >= 0

// splitLine :: String -> [String]
const splitLine = split(/\s+/)

// partsToOpPair :: [String] -> [String]
const partsToOpPair = (parts: Array<string>) : Array<string> => {
    const [op, arg, ...rest] = parts
    return [op.toUpperCase(), arg]
}

// lineToOpPair :: String -> [String]
const lineToOpPair = flow(splitLine, partsToOpPair)

// wrap :: a -> Result
const wrap = Result.of

// isOp :: [String] -> Result | Error
const isOp = (opPair: Array<string>) : ErrorResult => {
    const [op, ...rest] = opPair
    return isIn(ops, op) ? Result.of(opPair) : Error.of(`Undefined operation ${op}`)
}

// isMissingArgs :: [String] -> Result | Error
const isMissingArgs = (opPair: Array<string>) : ErrorResult => {
    const [op, arg, ...rest] = opPair
    return (isIn(withArg, op) && !arg) ?
            Error.of(`Operation ${op} requires an argument`)
            : Result.of(opPair)
}

// getOpObj :: [String] -> Result
const getOpObj = (opPair: Array<string>) : Result => {
    const [op, arg, ...rest] = opPair
    return isIn(numericOps, op) ?
        Result.of({ type: OP, op, arg: to32Float(parseFloat(arg)) })
        : Result.of({ type: OP, op, arg })
}

// getOp :: String -> Result | Error
const getOp = flow(lineToOpPair, wrap, map(isOp), map(isMissingArgs), map(getOpObj))

// parseLine :: String -> Result | Error
const parseLine = (line: string) => isLabel(line) ? getLabel(line) : getOp(line)

// reduceResults :: [String] -> Result | Error
const reduceResults = reduce((p, v) => p.acc(parseLine(v)), Result.of([]))

// parse :: String -> Result | Error
const parse = flow(splitIntoLines, filterEmptyLines, reduceResults)


export {splitIntoLines, filterEmptyLines, getLabel, getOp, parseLine, reduceResults, parse}
export default parse
