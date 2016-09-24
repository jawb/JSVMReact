import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Char from 'app/components/Char'


function setup(char) {
    const tree = TestUtils.renderIntoDocument(<div><Char char={char} /></div>)
    const component = tree.children[0]
    const node = ReactDOM.findDOMNode(component)

    return {component, node}
}

describe('components', () => {
    describe('Char', () => {
        test('should render a char, not a newline', () => {
            const {node} = setup('a')
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('char')
            expect(node.textContent).toEqual('a')
        })

        test('should render a char, is a newline', () => {
            const {node} = setup("\n")
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('char char-nl')
            expect(node.textContent).toEqual("\n")
        })
    })
})
