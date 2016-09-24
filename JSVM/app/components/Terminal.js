/* @flow */

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connectVM} from 'app/data/utils'
import * as actions from 'app/data/actions/actionCreators'
import {getStdOut, getStdOutChars, isReading} from 'app/data/reducers/selectors'
import isEqual from 'lodash/lang/isEqual'

import Char from 'app/components/Char'


export class Terminal extends Component {

    state: {
        input: string;
        cursorPos: number
    };

    constructor(props: any) {
        super(props)
        this.state = {input: "", cursorPos: 0}
    }

    shouldComponentUpdate = (nextProps: any, nextState: any) => {
        const stateChange = !isEqual(this.state, nextState)

        const lastStdout = getStdOut(this.props.vm)
        const newStdOut = getStdOut(nextProps.vm)
        const stdoutChange = lastStdout !== newStdOut

        const lastReading = isReading(this.props.vm)
        const newReading = isReading(nextProps.vm)
        const readingChange = lastReading !== newReading

        const propsChange = stdoutChange || readingChange
        return stateChange || propsChange
    }

    componentDidUpdate = () => {
        const input = this.refs.cursor
        if (input) input.focus()
        const node = ReactDOM.findDOMNode(this)
        node.scrollTop = node.scrollHeight
    }

    onChange = (e: {target: {value: string}}) => {
        if (e.target.value) {
            const value: string = e.target.value
            const input = [
                this.state.input.slice(0, this.state.cursorPos),
                value,
                this.state.input.slice(this.state.cursorPos)
            ].join('')
            this.setState({input, cursorPos: this.state.cursorPos + value.length})
            e.target.value = ''
        }
    }

    onKeyDown = (e: {keyCode: number}) => {
        switch(e.keyCode) {
            case 37:
                this.setState({cursorPos: Math.max(this.state.cursorPos - 1, 0)})
                break

            case 39:
                this.setState({cursorPos: Math.min(this.state.cursorPos + 1, this.state.input.length)})
                break

            case 13:
                this.props.dispatch(actions.readData(this.state.input))
                this.setState({input: "", cursorPos: 0})
                break

            case 8:
                if (this.state.cursorPos <= 0) return
                const input = [
                    this.state.input.slice(0, this.state.cursorPos - 1),
                    this.state.input.slice(this.state.cursorPos)
                ].join('')
                this.setState({input, cursorPos: Math.max(this.state.cursorPos - 1, 0)})
                break
        }
    }

    onBlur = (e: {target: {focus: Function}}) => { e.target.focus() }

    render() {
        const {vm} = this.props

        return (
            <div className="terminal">
                {getStdOutChars(vm).map((x, i) => <Char char={x} key={i} />)}
                {isReading(vm) ?
                    <span>
                        {this.state.input.slice(0, this.state.cursorPos).split('').map((x, i) => <Char char={x} key={i} />)}
                        <input className="terminal-cursor" style={{display: isReading(vm) === false ? 'none' : ''}}
                            onBlur={this.onBlur} onChange={this.onChange} ref="cursor" onKeyDown={this.onKeyDown} placeholder={this.state.input[this.state.cursorPos]} />
                        {this.state.input.slice(this.state.cursorPos + 1).split('').map((x, i) => <Char char={x} key={i} />)}
                    </span>
                : null}
            </div>
        )
    }
}

export default connectVM(Terminal)
