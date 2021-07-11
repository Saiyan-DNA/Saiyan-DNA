import axios from 'axios';

import { SENDING_EMAIL, EMAIL_SUCCESS, EMAIL_ERROR } from './types';

import { createMessage } from './messages'

export const requestUsernameEmail = (email) => (dispatch) => {
    dispatch({type: SENDING_EMAIL });

    // Headers
    const config = {
        headers: {'Content-Type': 'application/json'}
    };
    
    // Request Body
    const body = JSON.stringify({ "email": email});

    axios.post('/api/core/email_username', body, config)
        .then(res => {
            dispatch({type: EMAIL_SUCCESS, payload: res.data});
            dispatch(createMessage({type: "success", title: "username E-mail Sent"}));
        }).catch(err => {
            console.log(err);
            dispatch({type: EMAIL_ERROR, payload: err});
        });
}

export const requestVerificationEmail = (email) => (dispatch, getState) => {
    dispatch({type: SENDING_EMAIL });

    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    // Request Body
    const body = JSON.stringify({ "email": email});

    axios.post('/api/core/email_verification', body, config)
        .then(res => {
            dispatch({type: EMAIL_SUCCESS, payload: res.data});
            dispatch(createMessage({type: "success", title: "Verification E-mail Sent"}));
        }).catch(err => {
            console.log(err);
            dispatch({type: EMAIL_ERROR, payload: err});
        });
}