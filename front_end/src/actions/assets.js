import axios from 'axios';

import { ASSETS_LOADING, ASSETS_LOADED, CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET, GET_ASSET, CLEAR_ASSET } from './types';
import { createMessage } from './messages';

// GET_ASSETS
export const getAssets = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    dispatch({type: ASSETS_LOADING});

    axios.get('/api/financial/asset/', {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {

        dispatch({
            type: ASSETS_LOADED,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

// CREATE ASSET
export const createAsset = (asset) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.post('/api/financial/asset/', JSON.stringify(asset), config)
    .then(res => {
        dispatch({
            type: CREATE_ASSET,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

// UPDATE ASSET
export const updateAsset = (id, asset) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.put(`/api/financial/asset/${id}/`, JSON.stringify(asset), config)
    .then(res => {
        dispatch({
            type: UPDATE_ASSET,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

// DELETE_ASSET
export const deleteAsset = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.delete(`/api/financial/asset/${id}/`, config)
    .then(res => {
        dispatch({
            type: DELETE_ASSET,
            payload: id
        });
    }).catch(err => console.log(err));
};

// GET ASSET DETAILS
export const getAsset = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token

    const config = {
        headers: {
            "Authorization": `bearer ${jwt_token}`
        }
    }

    axios.get(`/api/financial/asset/${id}/`, config)
    .then(res => {
        dispatch({
            type: GET_ASSET,
            payload: res.data
        });
    }).catch(err => console.log(err));
}

export const clearAsset = () => (dispatch) => {
    dispatch({
        type: CLEAR_ASSET
    })
}