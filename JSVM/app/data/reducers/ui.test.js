import uiReducer from 'app/data/reducers/ui'
import ActionTypes  from 'app/data/constants/ActionTypes'

describe('data', () => {
    describe('ui reducer', () => {

        const ui0 = uiReducer(undefined, {type: 'NONE'});
        test('should return initial ui as first state', () => {
            expect(ui0).toEqual({
                loading: false,
                errorMsg: ""
            })
        })

        const ui1 = uiReducer(ui0, {type: ActionTypes.LOADING_STARTED});
        test('should set loading to true', () => {
            expect(ui1).toEqual({
                loading: true,
                errorMsg: ""
            })
        })

        const ui2 = uiReducer(ui1, {type: ActionTypes.PARSING_FINISHED});
        test('should set loading to false', () => {
            expect(ui2).toEqual({
                loading: false,
                errorMsg: ""
            })
        })

        const ui3 = uiReducer(ui2, {type: ActionTypes.DISPLAY_ERROR, errorMsg: 'Error!'});
        test('should set loading to false', () => {
            expect(ui3).toEqual({
                loading: false,
                errorMsg: 'Error!'
            })
        })
    })
})
