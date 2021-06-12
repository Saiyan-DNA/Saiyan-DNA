import { REGISTER_USER, REGISTRATION_ERROR, CLEAR_REGISTRATION_ERRORS } from '../actions/types';
import { USER_LOADED, USER_LOADING, AUTH_ERROR } from '../actions/types';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, CLEAR_LOGIN_ERROR } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: {},
    loginError: null,
    registrationErrors: {}
}

export default function(state = initialState, action, dispatch) {
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
        case CLEAR_REGISTRATION_ERRORS:
            return {
                ...state,
                registrationErrors: action.payload
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
            localStorage.removeItem('token');
            localStorage.removeItem('home');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                loginError: action.payload.field,
                user: {}
            }
        case LOGOUT_SUCCESS:
            localStorage.removeItem('token');
            localStorage.removeItem('home');
            return {
                ...state,
                token: null,
                user: {},
                isAuthenticated: null,
                isLoading: false,
                loginError: null
            }
        case CLEAR_LOGIN_ERROR:
            return {
                ...state,
                loginError: null
            }
        default:
            return state;
    }
}
