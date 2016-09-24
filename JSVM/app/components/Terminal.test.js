import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import {Terminal} from 'app/components/Terminal'


function setup(vm) {
    const props = {
        vm,
        dispatch: jest.fn()
    }

    const component = TestUtils.renderIntoDocument(<Terminal {...props} />)
    const node = ReactDOM.findDOMNode(component)

    return {component, node, props}
}

describe('components', () => {
    describe('Terminal', () => {
        it('should render empty terminal', () => {
            const {node} = setup({ stdout: '', reading: false })
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('terminal')
            expect(node.children.length).toEqual(0)
        })

        it('should render empty terminal with cursor in pos 0', () => {
            const {node} = setup({ stdout: '', reading: true })
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('terminal')
            expect(node.children.length).toEqual(1)
            const span = node.children[0]
            expect(span.nodeName).toEqual('SPAN')
            expect(span.children.length).toEqual(1)
            const cursor = span.children[0]
            expect(cursor.nodeName).toEqual('INPUT')
            expect(cursor.className).toEqual('terminal-cursor')
        })

        it('should render terminal with "text" and cursor in pos 0', () => {
            const {node} = setup({ stdout: 'test', reading: true })
            expect(node.nodeName).toEqual('DIV')
            expect(node.className).toEqual('terminal')
            expect(node.children.length).toEqual(5)
            const chars = Array.prototype.slice.call(node.children, 0, 4)
            expect(Array.prototype.map.call(chars, x => x.innerHTML).join('')).toEqual('test')
            const span = node.children[4]
            expect(span.nodeName).toEqual('SPAN')
            expect(span.children.length).toEqual(1)
            const cursor = span.children[0]
            expect(cursor.nodeName).toEqual('INPUT')
            expect(cursor.className).toEqual('terminal-cursor')
        })

        it('should render terminal with "hello " and cursor in pos 0, then enter "world", move, backspace and ENTER', () => {
            const {component, node, props} = setup({ stdout: 'hello ', reading: true })
            const span = node.children[6]
            const cursor = span.children[0]

            // enter
            TestUtils.Simulate.change(cursor, {target: {value: "world"}})
            expect(component.state).toEqual({input: 'world', cursorPos: 5})

            // move
            TestUtils.Simulate.keyDown(cursor, {keyCode: 39});
            expect(component.state.cursorPos).toEqual(5)
            TestUtils.Simulate.keyDown(cursor, {keyCode: 37});
            expect(component.state.cursorPos).toEqual(4)
            for (let i = 0; i <= 8; i++) TestUtils.Simulate.keyDown(cursor, {keyCode: 39});
            expect(component.state.cursorPos).toEqual(5)
            for (let i = 0; i <= 8; i++) TestUtils.Simulate.keyDown(cursor, {keyCode: 37})
            expect(component.state.cursorPos).toEqual(0)

            // backspace
            TestUtils.Simulate.change(cursor, {target: {value: "jss "}})
            expect(component.state.input).toEqual('jss world')
            TestUtils.Simulate.keyDown(cursor, {keyCode: 8})
            TestUtils.Simulate.keyDown(cursor, {keyCode: 8})
            TestUtils.Simulate.change(cursor, {target: {value: " "}})
            expect(component.state.input).toEqual('js world')

            // ENTER
            TestUtils.Simulate.keyDown(cursor, {keyCode: 13})
            expect(component.state).toEqual({input: '', cursorPos: 0})
            expect(props.dispatch).toHaveBeenCalled()
        })
    })
})
