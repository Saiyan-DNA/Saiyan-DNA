import jwt_decode from 'jwt-decode';

import { REGISTER_USER, REGISTRATION_ERROR, CLEAR_REGISTRATION_ERRORS } from '../actions/types';
import { USER_LOADED, USER_LOADING, AUTH_ERROR, TOKEN_EXPIRATION_CHECK, TOKEN_EXPIRED } from '../actions/types';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, CLEAR_LOGIN_ERROR } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    tokenExpires: new Date(localStorage.getItem('expires')).getTime(),
    tokenIsExpired: false,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    isLoading: false,
    user: {},
    loginError: null,
    deviceFamily: "Unknown",
    timeRemaining: 15,
    isMobile: false,
    isTablet: false,
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
                isAuthenticated: false,
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
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            var decodedToken = jwt_decode(action.payload.token);
            var expires = new Date(0)
            expires.setUTCSeconds(decodedToken.exp);

            localStorage.setItem('expires', expires)

            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                tokenExpires: expires,
                tokenIsExpired: false
            }
        case AUTH_ERROR:
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            localStorage.removeItem('home');
            return {
                ...state,
                token: null,
                user: {},
                isAuthenticated: false,
                isLoading: false
            }
        case LOGIN_FAIL:
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
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
            localStorage.removeItem('expires');
            localStorage.removeItem('home');
            return {
                ...state,
                token: null,
                user: {},
                isAuthenticated: false,
                isLoading: false,
                loginError: null
            }
        case TOKEN_EXPIRATION_CHECK:
            return {
                ...state,
                timeRemaining: action.payload
            }
        case TOKEN_EXPIRED: 
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            localStorage.removeItem('home');
            return {
                ...state,
                token: null,
                user: {},
                isAuthenticated: false,
                isLoading: false,
                loginError: null,
                tokenIsExpired: true,
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
