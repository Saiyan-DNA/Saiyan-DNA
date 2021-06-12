import axios from 'axios';

import { REGISTER_USER, REGISTRATION_ERROR, CLEAR_REGISTRATION_ERRORS } from './types';
import { USER_LOADED, USER_LOADING, USER_HOME, CLEAR_HOME } from './types';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, AUTH_ERROR } from './types';
import { CLEAR_LOGIN_ERROR } from './types';

import { createMessage } from './messages';

// Attempt Regisration of a new user
export const registerUser = (userInfo) => (dispatch, getState) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(userInfo);

    axios.post('/api/auth/register', body, config)
    .then(res => {
        if (res.data.token) {
            dispatch({
                type: REGISTER_USER,
                payload: res.data
            });
        }
        if (res.data.errors) {
            dispatch({type: REGISTRATION_ERROR, payload: res.data.errors});
        }

    }).catch(err => {
        dispatch({
            type: AUTH_ERROR
        });
    });    
}

export const clearRegistrationErrors = () => (dispatch, getState) => {
    dispatch({type: CLEAR_REGISTRATION_ERRORS, payload: {}})
}

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({type: USER_LOADING });

    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config & get user data
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;

        axios.get('/api/auth/user', config)
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: AUTH_ERROR
            });
            dispatch(createMessage({type: "error", title: "Autorization Error!", detail: err}));
        });
    } else {
        dispatch({
            type: AUTH_ERROR
        })
    }

    
}

// Log In User
export const userLogin = (username, password) => (dispatch) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Request Body
    const body = JSON.stringify({ username, password });

    axios.post('/api/auth/login', body, config)
        .then(res => {
            // If Logged-In user has only one, automatically select it.
            if (res.data.user) {
                let homes = res.data.user.homes
                if (homes.length == 1) {
                    dispatch({
                            type: USER_HOME,
                            payload: homes[0]
                    });
                }

                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: LOGIN_FAIL,
                    payload: res.data
                });
            }
        }).catch(err => {
            console.log(err);
            dispatch({
                type: LOGIN_FAIL,
                payload: err
            });
            dispatch(createMessage({type: "error", title: "Login Failed!", detail: err}));
        });
}

// Log Out user
export const userLogout = () => (dispatch) => {
    dispatch({type: LOGOUT_SUCCESS});
    dispatch({type: CLEAR_HOME});
}

// Clear Login Error State
export const clearLoginError = () => (dispatch) => {
    dispatch({type: CLEAR_LOGIN_ERROR});
}

// Check if User has specified permission
export const userHasPermission = (permName) => (dispatch, getState) => {
    const user = getState().auth.user;
    var hasPermission = false;

    if (user.groups) {
        user.groups.forEach(group => {
            group.permissions.forEach(perm => {
                if (perm.codename == permName) {
                    hasPermission = true;
                }
            });
        });

        return hasPermission;
    }
}
