import axios from 'axios';

import { SENDING_EMAIL, EMAIL_SUCCESS, EMAIL_ERROR } from './types';

export const requestUsernameEmail = (email) => (dispatch) => {
    dispatch({type: SENDING_EMAIL });

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Request Body
    const body = JSON.stringify({ "email": email});

    axios.post('/api/core/email_username', body, config)
        .then(res => {
            dispatch({
                type: EMAIL_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
            console.log(err);
            dispatch({
                type: EMAIL_ERROR,
                payload: err
            });
        });
}