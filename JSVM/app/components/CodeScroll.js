import React, {Component} from 'react'
import {connectVM} from 'app/data/utils'
import ReactDOM from 'react-dom'
import {getCode, getPC} from 'app/data/reducers/selectors'

import CodeLine from 'app/components/CodeLine'


export class CodeScroll extends Component {

    componentWillUpdate = (nextProps) => {
        this.shouldScroll = false

        const pc = getPC(nextProps.vm)
        const scrollerNode = this.refs.scroller
        const activeNode = ReactDOM.findDOMNode(this.refs[`line-${pc}`])

        if (activeNode === null) return

        const scrollerHeight = scrollerNode.offsetHeight
        const scrollerTop = scrollerNode.scrollTop
        const scrollerBottom = scrollerTop + scrollerHeight

        const activeTop = activeNode.offsetTop
        const activeHeight = activeNode.offsetHeight
        const activeBottom = activeTop + activeHeight

        const activeOnMiddle = Math.floor(activeTop / scrollerHeight)*scrollerHeight + (scrollerHeight / 2) - (activeHeight / 2)

        if (activeTop <= scrollerTop || activeBottom >= scrollerBottom) {
            this.scrollPos = activeOnMiddle
            this.shouldScroll = true
        }
    }

    componentDidUpdate = () => {
        const node = this.refs.scroller
        node.scrollTop = this.shouldScroll ? this.scrollPos : node.scrollTop
    }

    render() {
        const {vm} = this.props
        const pc = getPC(vm)

        return (
            <div className="code-scroller-container">
                <div className="code-scroller" ref="scroller">
                    {getCode(vm).map((line, i) =>
                        <CodeLine line={line} active={pc === i} ref={`line-${i}`} key={i} />)}
                </div>
            </div>
        )
    }
}

export default connectVM(CodeScroll)
