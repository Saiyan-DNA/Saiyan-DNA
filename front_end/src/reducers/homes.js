import { GET_HOMES, GET_HOME, CLEAR_HOME, CREATE_HOME, UPDATE_HOME, DELETE_HOME } from '../actions/types';

const initialState = {
    homes: [],
    selectedHome: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_HOMES:
            return {
                ...state,
                homes: action.payload
            };
        case GET_HOME:
            return {
                ...state,
                selectedHome: action.payload
            };
        case CLEAR_HOME:
            return {
                ...state,
                selectedHome: null
            };
        case CREATE_HOME:
        case UPDATE_HOME:
            return {
                ...state,
                selectedHome: action.payload
            };
        case DELETE_HOME:
            return {
                ...state,
                homes: state.homes.filter(home => home.id !== action.payload),
                selectedHome: null
            };
        default:
            return state;
    }
}
