import {to32Float, charTo32Float} from 'app/data/utils'

describe('data', () => {
    describe('utils', () => {

        test('should keep integers', () => {
            expect(to32Float(1)).toEqual(1)
            expect(to32Float(-1)).toBe(-1)
        })

        test('should trim long floats', () => {
            expect(to32Float(2.1**34)).not.toEqual(2.1**34)
        })

        test('should turn a letter into 32bit float', () => {
            expect(charTo32Float('a')).toEqual(0x00000061)
            expect(charTo32Float('♫')).toEqual(0x0000266B)
        })
    })
})
