import axios from 'axios';

import { ORGANIZATION_LOADING, ORGANIZATION_LOADED, ORGANIZATION_LOAD_ERROR } from './types';
import { CREATE_ORGANIZATION, UPDATE_ORGANIZATION, DELETE_ORGANIZATION, CLEAR_ORGANIZATION } from './types';
import { ORGANIZATIONS_LOADING, ORGANIZATIONS_LOADED, ORGANIZATIONS_LOAD_ERROR } from './types';

import { createMessage } from './messages';

// GET_ACCOUNTS
export const getOrganizations = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    dispatch({type: ORGANIZATIONS_LOADING});

    axios.get('/api/core/organization/', {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
            dispatch({type: ORGANIZATIONS_LOADED, payload: res.data});
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Error Loading Organizations!", detail: err}));
            dispatch({type: ORGANIZATIONS_LOAD_ERROR, payload: err})
    });
};