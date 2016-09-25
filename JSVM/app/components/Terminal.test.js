import React from 'react'
import {mount} from 'enzyme'
import {Terminal} from 'app/components/Terminal'


const setup = vm => {
    const dispatch = jest.fn()
    const wrapper = mount(<Terminal vm={vm} dispatch={dispatch} />)

    return {wrapper, dispatch}
}

describe('components', () => {
    describe('Terminal', () => {
        it('should render empty terminal', () => {
            const {wrapper} = setup({ stdout: '', reading: false })
            expect(wrapper.find('div.terminal').length).toEqual(1)
            expect(wrapper.find('div.terminal').children().length).toEqual(0)
            expect(wrapper.find('input.terminal-cursor').length).toEqual(0)
        })

        it('should render empty terminal with cursor in pos 0', () => {
            const {wrapper} = setup({ stdout: '', reading: true })
            expect(wrapper.find('div.terminal').length).toEqual(1)
            expect(wrapper.find('div.terminal').children().length).toEqual(1)
            expect(wrapper.find('input.terminal-cursor').length).toEqual(1)
        })

        it('should render terminal with "test" and cursor in pos 0', () => {
            const {wrapper} = setup({ stdout: 'test', reading: true })
            expect(wrapper.find('div.terminal').length).toEqual(1)
            expect(wrapper.find('div.terminal').children().length).toEqual(5)
            expect(wrapper.find('div.terminal').text()).toEqual('test')
            expect(wrapper.find('input.terminal-cursor').length).toEqual(1)
            expect(wrapper.find('div.terminal span').childAt(0).hasClass('terminal-cursor')).toEqual(true)
        })

        it('should render terminal with "hello " and cursor in pos 0, then enter "world", move, backspace and ENTER', () => {
            const {wrapper, dispatch} = setup({ stdout: 'hello ', reading: true })

            const cursor = wrapper.find('input.terminal-cursor')

            // enter
            cursor.simulate('change', {target: {value: "world"}})
            expect(wrapper.state()).toEqual({input: 'world', cursorPos: 5})

            // move
            cursor.simulate('keyDown', {keyCode: 39})
            expect(wrapper.state('cursorPos')).toEqual(5)
            cursor.simulate('keyDown', {keyCode: 37})
            expect(wrapper.state('cursorPos')).toEqual(4)
            for (let i = 0; i <= 8; i++) cursor.simulate('keyDown', {keyCode: 39})
            expect(wrapper.state('cursorPos')).toEqual(5)
            for (let i = 0; i <= 8; i++) cursor.simulate('keyDown', {keyCode: 37})
            expect(wrapper.state('cursorPos')).toEqual(0)

            // backspace
            cursor.simulate('change', {target: {value: "jss "}})
            expect(wrapper.state('input')).toEqual('jss world')
            cursor.simulate('keyDown', {keyCode: 8})
            cursor.simulate('keyDown', {keyCode: 8})
            cursor.simulate('change', {target: {value: " "}})
            expect(wrapper.state('input')).toEqual('js world')

            // ENTER
            cursor.simulate('keyDown', {keyCode: 13})
            expect(wrapper.state()).toEqual({input: '', cursorPos: 0})
            expect(dispatch).toHaveBeenCalled()
        })
    })
})
