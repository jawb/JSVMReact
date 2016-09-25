import React from 'react'
import {mount} from 'enzyme'
import Char from 'app/components/Char'


const setup = char => mount(<Char char={char} />)

describe('components', () => {
    describe('Char', () => {
        test('should render a char, not a newline', () => {
            const wrapper = setup('a')
            expect(wrapper.find('div.char').length).toEqual(1)
            expect(wrapper.find('div.char.char-nl').length).toEqual(0)
            expect(wrapper.find('div.char').text()).toEqual('a')
        })

        test('should render a char, is a newline', () => {
            const wrapper = setup("\n")
            expect(wrapper.find('div.char.char-nl').length).toEqual(1)
            expect(wrapper.find('div.char.char-nl').text()).toEqual("\n")
        })
    })
})
