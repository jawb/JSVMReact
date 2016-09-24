import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Footer from 'app/components/Footer'


function setup(date) {
    const tree = TestUtils.renderIntoDocument(<div><Footer date={date} /></div>)
    const component = tree.children[0]
    const node = ReactDOM.findDOMNode(component)

    return {component, node}
}

describe('components', () => {
    describe('Footer', () => {
        test('should render the footer with date', () => {
            const {node} = setup(2016)
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('footer')
            expect(node.textContent).toEqual('© JSVM 2016')
        })
    })
})
