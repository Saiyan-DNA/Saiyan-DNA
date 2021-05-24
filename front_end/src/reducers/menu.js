import { TOGGLE_MENU } from '../actions/types.js';

const initialState = {
    opened: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case TOGGLE_MENU:
            return (state = {opened: !state.opened});           
        default:
            return state;
    }
}
