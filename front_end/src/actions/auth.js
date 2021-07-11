import axios from 'axios';

import { REGISTER_USER, REGISTRATION_ERROR, CLEAR_REGISTRATION_ERRORS } from './types';
import { USER_LOADED, USER_LOADING, USER_HOME, CLEAR_HOME } from './types';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, AUTH_ERROR } from './types';
import { CLEAR_LOGIN_ERROR, TOKEN_EXPIRATION_CHECK, TOKEN_EXPIRED } from './types';
import { VERIFYING_USER, USER_VERIFIED, VERIFICATION_ERROR } from './types';

import { createMessage } from './messages';
import { toggleTimeoutModal } from './navigation';
import { getAccount } from './accounts';

import { requestVerificationEmail } from './email';

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
            dispatch(requestVerificationEmail(res.data.user.email));
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

export const refreshToken = () => (dispatch, getState) => {
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    config.headers['Authorization'] = `Bearer ${token}`;

    const body = { "token": token };

    axios.post('/api/auth/token_refresh', body, config)
    .then(res => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch({
            type: AUTH_ERROR
        });
        dispatch(createMessage({type: "error", title: "Autorization Error!", detail: err}));
    });

}

export const checkTokenExpiration = () => (dispatch, getState) => {
    const { tokenExpires, tokenIsExpired } = getState().auth;
    const { timeoutModalOpen } = getState().navigation;

    if (tokenExpires && !tokenIsExpired) {
        // Determine if the token is expired
        const current_time = new Date();
        let remaining = (tokenExpires - current_time.getTime())/60000;

        // If expired, notify the user and automatically log the user out.
        if (remaining <= 0.25) {
            if (timeoutModalOpen) {
                dispatch(toggleTimeoutModal());
            }

            dispatch({type: TOKEN_EXPIRED});
            dispatch(createMessage({type: "warning", title: "Logged out due to inactivity."}));
            return;
        }

        // If time remaining is less than 5 minutes, attempt to refresh the token.
        if (remaining < 5) {
            if (!timeoutModalOpen) {
                dispatch(toggleTimeoutModal());
            }
        }

        dispatch({
            type: TOKEN_EXPIRATION_CHECK,
            payload: remaining
        });
    }
}

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // Get token from state
    const { token, isAuthenticated } = getState().auth;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // If token, add to headers config & get user data
    if(token && isAuthenticated) {
        dispatch({type: USER_LOADING });

        // If token has not expired, retrieve user details from the API       

        config.headers['Authorization'] = `Bearer ${token}`;

        axios.get('/api/auth/user', config)
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });

            let storedAccountId = localStorage.getItem("accountId");
            if (storedAccountId) {
                dispatch(getAccount(storedAccountId));
            }
        }).catch(err => {
            dispatch({
                type: AUTH_ERROR
            });
            dispatch(createMessage({type: "error", title: "Autorization Error!"}));
        });

    } else {
        userLogout();
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

// Perform User Account Verification
export const verifyUserAccount = (verificationCode) => (dispatch, getState) => {
    // Get token from state
    const { token, isAuthenticated } = getState().auth;

    // Headers
    const config = {
        headers: {'Content-Type': 'application/json'}
    }

    const body = JSON.stringify({ "code": verificationCode });

    // If token, add to headers config & get user data
    if(token && isAuthenticated) {
        dispatch({type: VERIFYING_USER });

        // If token has not expired, attempt to verify the user with the provided verification code.    

        config.headers['Authorization'] = `Bearer ${token}`;

        axios.post('/api/core/activate_account', body, config)
        .then(res => {
            if (res.data.error) {
                dispatch({type: VERIFICATION_ERROR});
                dispatch(createMessage({type: "error", title: res.data.error}));
                return;
            }

            if (res.data.success) {
                dispatch({type: USER_VERIFIED, payload: res.data});
                dispatch(createMessage({type: "success", title: "Account Verified"}));

                // Re-load user data to reflect status is Active. Wait 3 seconds to allow time for verification process to complete.
                // TODO: There should be a better way.
                setTimeout(() => dispatch(loadUser()), 3000);
                return;
            }
        }).catch(err => {
            dispatch({type: VERIFICATION_ERROR});
            dispatch(createMessage({type: "error", title: "Failed to Verify User Account!"}));
        });

    } else {
        dispatch({type: VERIFICATION_ERROR});
        dispatch(createMessage({type: "error", title: "Failed to Verify User Account!"}));
    }

}
