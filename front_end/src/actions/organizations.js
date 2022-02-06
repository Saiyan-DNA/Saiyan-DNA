import axios from 'axios';

import { ORGANIZATION_LOADING, ORGANIZATION_LOADED, ORGANIZATION_LOAD_ERROR } from './types';
import { CREATE_ORGANIZATION, UPDATE_ORGANIZATION, CLEAR_ORGANIZATION, SAVE_ORGANIZATION } from './types';
import { ORGANIZATION_DELETING, DELETE_ORGANIZATION } from './types';
import { ORGANIZATIONS_LOADING, ORGANIZATIONS_LOADED, ORGANIZATIONS_LOAD_ERROR } from './types';

import { createMessage } from './messages';

// GET_ORGANIZATIONS
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

// GET_ORGANIZATION
export const getOrganization = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    dispatch({type: ORGANIZATION_LOADING});

    axios.get('/api/core/organization/' + id, {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
            dispatch({type: ORGANIZATION_LOADED, payload: res.data});
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Error Loading Organizations!", detail: err}));
            dispatch({type: ORGANIZATION_LOAD_ERROR, payload: err})
    });
};

// SAVE ORGANIZATION
export const saveOrganization = (org) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    dispatch({type: SAVE_ORGANIZATION});

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    if (org.id) {
        axios.put(`/api/core/organization/${org.id}/`, JSON.stringify(org), config)
        .then(res => {
            dispatch({
                type: UPDATE_ORGANIZATION,
                payload: res.data
            });

            var successMessage = "Saved Organization '" + org.name + "'";
            dispatch(createMessage({type: "success", title: successMessage}));

        }).catch(err => dispatch(createMessage({type: "error", title: "Error Saving Oraganization!", detail: err})));
    } else {
        axios.post('/api/core/organization/', JSON.stringify(org), config)
        .then(res => {
            dispatch({
                type: CREATE_ORGANIZATION,
                payload: res.data
            });

            var successMessage = "Added Organization '" + org.name + "'";

            dispatch(createMessage({type: "success", title: successMessage}));
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Error Adding Organization!", detail: err}));
        });
    }
};

// DELETE_ORGANIZATION
export const deleteOrganization = (id) => (dispatch, getState) => {
    dispatch({type: ORGANIZATION_DELETING});

    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.delete(`/api/core/organization/${id}/`, config)
    .then(res => {
        dispatch({
            type: DELETE_ORGANIZATION,
            payload: id
        });

        dispatch(createMessage({type: "success", title: "Organization Deleted"}));
    }).catch(err => dispatch(createMessage({type: "error", title: "Unable to Delete Organization!", detail: err})));
};

export const clearOrganization = () => (dispatch) => {
    dispatch({
        type: CLEAR_ORGANIZATION
    })
}