import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from 'app/data/actions/actionCreators'


export class Controllers extends Component {

    execNext = () => this.props.dispatch(actions.exec())

    startExec = () => this.props.dispatch(actions.startExecuter())

    pauseExec = () => this.props.dispatch(actions.stopExecuter())

    stopExec = () => this.props.dispatch(actions.resetVM())

    fastForward = () => this.props.dispatch(actions.startFastExecuter())

    render() {
        return (
            <div className="controllers">
                <button onClick={this.execNext} title="Step forward"><i className="fa fa-step-forward" /></button>
                <button onClick={this.startExec} title="Step by step"><i className="fa fa-forward" /></button>
                <button onClick={this.pauseExec} title="Pause execution"><i className="fa fa-pause" /></button>
                <button onClick={this.stopExec} title="Stop execution"><i className="fa fa-stop" /></button>
                <button onClick={this.fastForward} title="Direct result"><i className="fa fa-fast-forward" /></button>
            </div>
        )
    }
}

export default connect()(Controllers)
