import { CREATE_MESSAGE, CLEAR_MESSAGE } from '../actions/types.js';

const initialState = {
    messageDetail: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CREATE_MESSAGE:
            return (state = {
                messageDetail: action.payload
            });
        case CLEAR_MESSAGE:
            return (state = {
                messageDetail: null
            });
        default:
            return state;
    }
}
