import React, {Component} from 'react'
import {DropTarget, DragDropContext} from 'react-dnd'
import HTML5Backend, {NativeTypes} from 'react-dnd-html5-backend'
import * as actions from 'app/data/actions/actionCreators'
import readFile from 'app/data/vm/readFile'
import {getCodeLines, getErrorMessage, isLoading} from 'app/data/reducers/selectors'
import {connectState} from 'app/data/utils'
import flow from 'lodash/function/flow'

import Header from 'app/components/Header'
import Executer from 'app/components/Executer'
import Footer from 'app/components/Footer'


export class Container extends Component {

    render() {
        const {vm, ui, connectDropTarget} = this.props

        return connectDropTarget(
            <div className="main">
                <Header />
                {getCodeLines(vm) > 0 ?
                    <Executer />
                    :
                    <div className="drop-file">
                        {getErrorMessage(ui) ?
                            <span className="error">{getErrorMessage(ui)}</span>
                            :
                            <span>{isLoading(ui) ? "Loading..." : "Drop file here"}</span>
                        }
                    </div>
                }
                <Footer date={(new Date).getFullYear()} />
            </div>
        )
    }
}

const DragDropContextF = DragDropContext(HTML5Backend)

const dropSpecs = {
    drop(props, monitor, component) {
        props.dispatch(actions.loadingStarted())
        const file = monitor.getItem().files[0]
        readFile(file)
            .then((text) => props.dispatch(actions.loadingFinished(text)))
            .error(() => props.dispatch(actions.reportError("Unable to read file")))
    }
}

const DropTargetF = DropTarget(NativeTypes.FILE, dropSpecs, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget()
}))

export default flow(DropTargetF, DragDropContextF, connectState)(Container)
