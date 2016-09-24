/* @flow */

import {connect} from 'react-redux'
import {getVM, getUI} from 'app/data/reducers/selectors'


export function to32Float(x: number) {
    let _float = new Float32Array(new ArrayBuffer(4));
    _float[0] = x;
    return _float[0];
}

export function charTo32Float(x: string) {
    const charCode = x.charCodeAt(0);
    return to32Float(charCode);
}

export const connectVM = (x: any) => connect((state: State) => ({vm: getVM(state)}))(x)
export const connectUI = (x: any) => connect((state: State) => ({ui: getUI(state)}))(x)
export const connectState = (x: any) => connect((state: State) => ({
    ui: getUI(state),
    vm: getVM(state)
}))(x)
