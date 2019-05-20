import * as types from '../ActionTypes';

const initialState = {
    loading: false,
    myBooks: [],
    fontSize:20,
    bgColor:'#FFF9DE'
}

export default function booksReducers(state = initialState, action) {
    switch (action.type) {
        case types.ADD_BOOKS:
            return Object.assign({}, state, {
              myBooks:action.myBooks
            });
        case types.ADD_FONTSIZE:
            return Object.assign({}, state, {
              fontSize:parseInt(state.fontSize)+2
            });
        case types.MINUS_FONTSIZE:
            return Object.assign({}, state, {
              fontSize:parseInt(state.fontSize)-2
            });
        case types.SET_BGCOLOR:
            return Object.assign({}, state, {
              bgColor:action.bgColor
            });
        default:
            return state;
    }
}
