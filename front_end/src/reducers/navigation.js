import { SET_TITLE, USER_NAV, USER_HOME, CLEAR_HOME, TOGGLE_HOME_MODAL, TOGGLE_TIMEOUT_MODAL } from '../actions/types.js';

const initialState = {
    headerTitle: "Home Central",
    currentPath: localStorage.getItem("path") || "/",
    currentHome: {},
    homeModalOpen: false,
    timeoutModalOpen: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_TITLE:
            return {
                ...state,
                headerTitle: action.payload
            };
        case USER_NAV:
            localStorage.setItem("path", action.payload);
            return {
                ...state,
                currentPath: action.payload
            };
        case USER_HOME:
            localStorage.setItem("homeId", action.payload.id)
            return {
                ...state,
                currentHome: action.payload
            };
        case CLEAR_HOME:
            localStorage.removeItem("home");
            return {
                ...state,
                currentHome: { name: ""}
            };
        case TOGGLE_HOME_MODAL:
            return {
                ...state,
                homeModalOpen: !state.homeModalOpen
            };
        case TOGGLE_TIMEOUT_MODAL:
            return {
                ...state,
                timeoutModalOpen: !state.timeoutModalOpen
            };
        default:
            return state;
    }
}
