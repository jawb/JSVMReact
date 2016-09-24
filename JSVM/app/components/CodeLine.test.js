import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import CodeLine from 'app/components/CodeLine'
import LineTypes from 'app/data/constants/LineTypes'

const {LABEL, OP} = LineTypes;


function setup(line, active) {
    const component = TestUtils.renderIntoDocument(<CodeLine line={line} active={active} />)
    const node = ReactDOM.findDOMNode(component)

    return {component, node}
}

describe('components', () => {
    describe('CodeLine', () => {
        test('should render label', () => {
            const {node} = setup({
                type: LABEL,
                arg: "Begin",
                op: null
            })
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('code-line')
            expect(node.children.length).toEqual(1)
            const span = node.children[0]
            expect(span.nodeName).toEqual('SPAN')
            expect(span.className).toEqual('code-line-label')
            expect(span.textContent).toEqual('Begin')
            expect(span.children.length).toEqual(1)
            const i = span.children[0]
            expect(i.nodeName).toEqual('I')
            expect(i.className).toEqual('code-line-label-icon')
        })

        test('should render op with arg', () => {
            const {node} = setup({ type: OP, op: 'PUSH', arg: 5 })
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('code-line')
            expect(node.children.length).toEqual(1)
            const span = node.children[0]
            expect(span.nodeName).toEqual('SPAN')
            expect(span.className).toEqual('code-line-op')
            expect(span.children.length).toEqual(2)
            const subSpan1 = span.children[0]
            expect(subSpan1.nodeName).toEqual('SPAN')
            expect(subSpan1.textContent).toEqual('PUSH')
            expect(subSpan1.className).toEqual('code-line-cmd')
            const subSpan2 = span.children[1]
            expect(subSpan2.nodeName).toEqual('SPAN')
            expect(subSpan2.textContent).toEqual('5')
            expect(subSpan2.className).toEqual('code-line-arg')
        })

        test('should render op no arg', () => {
            const {node} = setup({ type: OP, op: 'POP', arg: undefined })
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('code-line')
            expect(node.children.length).toEqual(1)
            const span = node.children[0]
            expect(span.nodeName).toEqual('SPAN')
            expect(span.className).toEqual('code-line-op')
            expect(span.children.length).toEqual(1)
            const subSpan1 = span.children[0]
            expect(subSpan1.nodeName).toEqual('SPAN')
            expect(subSpan1.textContent).toEqual('POP')
            expect(subSpan1.className).toEqual('code-line-cmd')
        })
    })
})
