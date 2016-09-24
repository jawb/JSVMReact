import React, {Component} from 'react'
import {connectVM} from 'app/data/utils'
import {getStack} from 'app/data/reducers/selectors'


export class Stack extends Component {

    render() {
        const {vm} = this.props

        return (
            <div className="stack-container">
                <div className="stack-scroller">
                    {getStack(vm).map((x, i) => 
                        <div className="stack-element" key={i}>{x}</div>
                    )}
                </div>
            </div>
        )
    }
}

export default connectVM(Stack)
