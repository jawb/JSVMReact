/* @flow */

import React, {Component} from 'react'
import classNames from 'classnames'
import {isLabel, getArg, getOp} from 'app/data/reducers/selectors'


export default class CodeLine extends Component {

    render() {
        const {line, active} = this.props

        return (
            <div className={classNames("code-line", {active})}>
            {isLabel(line) ?
                <span className="code-line-label">
                    <i className="code-line-label-icon" />{getArg(line)}
                </span>
            :
                <span className="code-line-op">
                    <span className="code-line-cmd">{getOp(line)}</span>
                    {getArg(line) !== undefined ?
                        <span className="code-line-arg">{getArg(line)}</span> : null}
                </span>
            }
            </div>
        )
    }
}
