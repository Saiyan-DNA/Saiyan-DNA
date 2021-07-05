import { TOGGLE_NAV_MENU, TOGGLE_USER_MENU } from '../actions/types.js';

const initialState = {
    navMenuOpen: false,
    userMenuOpen: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case TOGGLE_NAV_MENU:
            return {
                ...state,
                navMenuOpen: !state.navMenuOpen
            };
        case TOGGLE_USER_MENU:
            return {
                ...state,
                userMenuOpen: !state.userMenuOpen,
                userMenuTarget: action.payload
            };            
        default:
            return state;
    }
}
