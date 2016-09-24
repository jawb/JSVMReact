import {Result, Error} from 'app/data/func'
import LineTypes from 'app/data/constants/LineTypes'
import {splitIntoLines, filterEmptyLines, getLabel, getOp,
        parseLine, reduceResults, parse} from 'app/data/vm/parser'
const {LABEL, OP} = LineTypes


describe('data', () => {
    describe('parser', () => {

        test('should split string into lines', () => {
            expect(splitIntoLines('\nstr1\nstr2\nstr3\n'))
                .toEqual(['', 'str1', 'str2', 'str3', ''])
        })

        test('should filter empty lines', () => {
            expect(filterEmptyLines(['', 'str1', 'str2', 'str3', '']))
                .toEqual(['str1', 'str2', 'str3'])
        })

        test('should get label', () => {
            expect(getLabel('Begin:').unwrap())
                .toEqual({ type: LABEL, arg: 'Begin' })
        })

        test('should get op or error', () => {
            const push5Op = getOp('PUSH 5')
            expect(push5Op.isError()).toBe(false)
            expect(push5Op.unwrap()).toEqual({ type: OP, op: 'PUSH', arg: 5 })

            const jump5Op = getOp('JMP 5')
            expect(jump5Op.isError()).toBe(false)
            expect(jump5Op.unwrap()).toEqual({ type: OP, op: 'JMP', arg: '5' })

            const pushOp = getOp('PUSH')
            expect(pushOp.isError()).toBe(true)
            expect(pushOp.unwrap()).toEqual('Operation PUSH requires an argument')

            const noOp = getOp('NO_OP')
            expect(noOp.isError()).toBe(true)
            expect(noOp.unwrap()).toEqual('Undefined operation NO_OP')
        })

        test('should return label, op or error', () => {
            const beginLabel = parseLine('Begin:')
            expect(beginLabel.isError()).toBe(false)
            expect(beginLabel.unwrap()).toEqual({ type: LABEL, arg: 'Begin' })

            const push5Op = parseLine('PUSH 5')
            expect(push5Op.isError()).toBe(false)
            expect(push5Op.unwrap()).toEqual({ type: OP, op: 'PUSH', arg: 5 })

            const pushOp = parseLine('PUSH')
            expect(pushOp.isError()).toBe(true)
            expect(pushOp.unwrap()).toEqual('Operation PUSH requires an argument')

            const noOp = parseLine('NO_OP')
            expect(noOp.isError()).toBe(true)
            expect(noOp.unwrap()).toEqual('Undefined operation NO_OP')
        })

        test('should accumulate ops and short-circuit on error', () => {
            const code1 = reduceResults(['Begin:', 'PUSH 5', 'POP'])
            expect(code1.isError()).toBe(false)
            expect(code1.unwrap()).toEqual([
                { type: LABEL, arg: 'Begin' },
                { type: OP, op: 'PUSH', arg: 5 },
                { type: OP, op: 'POP', arg: undefined }
            ])

            const code2 = reduceResults(['Begin:', 'PUSH 5', 'NO_OP', 'POP'])
            expect(code2.isError()).toBe(true)
            expect(code2.unwrap()).toEqual('Undefined operation NO_OP')
        })

        test('should parse code', () => {
            const code1 = parse('\nBegin:\n  \nPUSH 5\n  \nPOP\n')
            expect(code1.isError()).toBe(false)
            expect(code1.unwrap()).toEqual([
                { type: LABEL, arg: 'Begin' },
                { type: OP, op: 'PUSH', arg: 5 },
                { type: OP, op: 'POP', arg: undefined }
            ])

            const code2 = parse('\nBegin:\n  \nPUSH 5\nNO_OP\nPOP\n')
            expect(code2.isError()).toBe(true)
            expect(code2.unwrap()).toEqual('Undefined operation NO_OP')
        })
    })
})
