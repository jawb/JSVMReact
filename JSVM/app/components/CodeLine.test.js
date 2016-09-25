import React from 'react'
import {mount} from 'enzyme'

import CodeLine from 'app/components/CodeLine'
import LineTypes from 'app/data/constants/LineTypes'

const {LABEL, OP} = LineTypes;


const setup = (line, active) => mount(<CodeLine line={line} active={active} />)

describe('components', () => {
    describe('CodeLine', () => {
        test('should render label', () => {
            const wrapper = setup({ type: LABEL, arg: 'Begin', op: null })
            const rootWrapper = wrapper.find('div.code-line')
            expect(rootWrapper.length).toEqual(1)
            expect(rootWrapper.children().length).toEqual(1)
            const spanWrapper = rootWrapper.find('span.code-line-label')
            expect(spanWrapper.text()).toEqual('Begin')
            expect(spanWrapper.find('i.code-line-label-icon').length).toEqual(1)
        })

        test('should render op with arg', () => {
            const wrapper = setup({ type: OP, op: 'PUSH', arg: 5 })
            const rootWrapper = wrapper.find('div.code-line')
            expect(rootWrapper.length).toEqual(1)
            expect(rootWrapper.children().length).toEqual(1)
            const spanWrapper = rootWrapper.find('span.code-line-op')
            expect(spanWrapper.children().length).toEqual(2)
            expect(spanWrapper.find('span.code-line-cmd').text()).toEqual('PUSH')
            expect(spanWrapper.find('span.code-line-arg').text()).toEqual('5')
        })

        test('should render op no arg', () => {
            const wrapper = setup({ type: OP, op: 'POP', arg: undefined })
            const rootWrapper = wrapper.find('div.code-line')
            expect(rootWrapper.length).toEqual(1)
            expect(rootWrapper.children().length).toEqual(1)
            const spanWrapper = rootWrapper.find('span.code-line-op')
            expect(spanWrapper.children().length).toEqual(1)
            expect(spanWrapper.find('span.code-line-cmd').text()).toEqual('POP')
            expect(spanWrapper.find('span.code-line-arg').length).toEqual(0)
        })
    })
})
