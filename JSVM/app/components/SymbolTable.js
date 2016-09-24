/* @flow */

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connectVM} from 'app/data/utils'
import {mapTableSymbol} from 'app/data/reducers/selectors'
import shallowCompare from 'react-addons-shallow-compare'


export class SymbolTable extends Component {

    scrollHeight: number
    scrollTop: number

    shouldComponentUpdate = (nextProps: any, nextState: any) => shallowCompare(this, nextProps, nextState)

    componentWillUpdate = () => {
        const node = ReactDOM.findDOMNode(this)
        this.scrollHeight = node.scrollHeight
        this.scrollTop = node.scrollTop
    }

    componentDidUpdate = () => {
        const node = ReactDOM.findDOMNode(this)
        node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight)
    }

    render() {
        const {vm} = this.props

        return (
            <div className="symbol-table">
                <div className="symbol-table-header">
                    <div className="symbol-table-cell">Symbol</div>
                    <div className="symbol-table-cell">Value</div>
                </div>
                <div className="symbol-table-body">
                    {mapTableSymbol(vm, (variable, value, i) =>
                        (<div key={i}>
                            <div className="symbol-table-cell">{variable}</div>
                            <div className="symbol-table-cell">{value}</div>
                        </div>)
                    )}
                </div>
            </div>
        )
    }
}

export default connectVM(SymbolTable)
