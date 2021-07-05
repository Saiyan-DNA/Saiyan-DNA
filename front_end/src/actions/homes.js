import axios from 'axios';

import { GET_HOMES, GET_HOME, CLEAR_HOME, CREATE_HOME, UPDATE_HOME, DELETE_HOME } from './types';
import { createMessage } from './messages';

// GET HOMES
export const getHomes = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    axios.get('/api/core/home', {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {

        dispatch({
            type: GET_HOMES,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

// CREATE HOME
export const createHome = (acct) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.post('/api/core/home/', JSON.stringify(home), config)
    .then(res => {
        dispatch({
            type: CREATE_HOME,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

// UPDATE HOME
export const updateHome = (id, home) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.put(`/api/core/home/${id}/`, JSON.stringify(home), config)
    .then(res => {
        dispatch({
            type: UPDATE_HOME,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

// DELETE HOME
export const deleteHome = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.delete(`/api/core/home/${id}/`, config)
    .then(res => {
        dispatch({
            type: DELETE_HOME,
            payload: id
        });
    }).catch(err => console.log(err));
};

// GET HOME DETAILS
export const getHome = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token

    const config = {
        headers: {
            "Authorization": `bearer ${jwt_token}`
        }
    }

    axios.get(`/api/core/home/${id}`, config)
    .then(res => {
        dispatch({
            type: GET_HOME,
            payload: res.data
        });
    }).catch(err => console.log(err));
}

export const clearHome = () => (dispatch) => {
    dispatch({
        type: CLEAR_HOME
    })
}
