import React from 'react'
import {mount} from 'enzyme'
import Footer from 'app/components/Footer'


const setup = date => mount(<Footer date={date} />)


describe('components', () => {
    describe('Footer', () => {
        test('should render the footer with date', () => {
            const wrapper = setup(2016)
            expect(wrapper.find('div.footer').length).toEqual(1)
            expect(wrapper.find('div.footer').text()).toEqual('© JSVM 2016')
        })
    })
})
