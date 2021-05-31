import { REGISTER_USER, REGISTRATION_ERROR, USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: {},
    registrationErrors: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case REGISTER_USER:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                registrationErrors: {},
                isAuthenticated: true,
                isLoading: false
            }
        case REGISTRATION_ERROR:
            localStorage.removeItem('token');
            localStorage.removeItem('home');
            return {
                ...state,
                registrationErrors: action.payload,
                isAuthenticated: null,
                isLoading: false,
                user: {}
            }
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            }
        case AUTH_ERROR:
            localStorage.removeItem('token');
            localStorage.removeItem('home');
            return {
                ...state,
                token: null,
                user: {},
                isAuthenticated: null,
                isLoading: false
            }
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.removeItem('token');
            localStorage.removeItem('home');
            return {
                ...state,
                token: null,
                user: {},
                isAuthenticated: null,
                isLoading: false
            }
        default:
            return state;
    }
}
