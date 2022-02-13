import axios from 'axios';

import { ACCOUNT_LOADING, ACCOUNT_LOADED, ACCOUNT_LOAD_ERROR, CLEAR_ACCOUNT } from './types';
import { CREATE_ACCOUNT, UPDATE_ACCOUNT, ACCOUNT_DELETING, DELETE_ACCOUNT } from './types';
import { ACCOUNTS_LOADING, ACCOUNTS_LOADED, RESET_NET_WORTH } from './types';

import { GET_FINANCIAL_INSTITUTION, GET_FINANCIAL_INSTITUTIONS } from './types';
import { createMessage } from './messages';

// GET_ACCOUNTS
export const getAccounts = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    dispatch({type: ACCOUNTS_LOADING});

    axios.get('/api/financial/account/', {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
            dispatch({type: ACCOUNTS_LOADED, payload: res.data});
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Error Loading Accounts!", detail: err}));
            dispatch({type: ACCOUNTS_LOAD_ERROR, payload: err})
    });
};

// CREATE ACCOUNT
export const createAccount = (acct) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.post('/api/financial/account', JSON.stringify(acct), config)
    .then(res => {
        dispatch({
            type: CREATE_ACCOUNT,
            payload: res.data
        });

        // dispatch(getAccount(res.data.id));

        var successMessage = "Added Account '" + acct.name + "'";

        dispatch(createMessage({type: "success", title: successMessage}));
    }).catch(err => {
        dispatch(createMessage({type: "error", title: "Error Adding Account!", detail: err}));
    });
};

// UPDATE ACCOUNT
export const updateAccount = (id, acct) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.put(`/api/financial/account/${id}/`, JSON.stringify(acct), config)
    .then(res => {
        dispatch({
            type: UPDATE_ACCOUNT,
            payload: res.data
        });
        dispatch({type: RESET_NET_WORTH});

        var successMessage = "Updated Account '" + acct.name + "'";
        dispatch(createMessage({type: "success", title: successMessage}));

    }).catch(err => dispatch(createMessage({type: "error", title: "Error Updating Account!", detail: err})));
};

// DELETE_ACCOUNT
export const deleteAccount = (id) => (dispatch, getState) => {
    dispatch({type: ACCOUNT_DELETING});

    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.delete(`/api/financial/account/${id}/`, config)
    .then(res => {
        dispatch({
            type: DELETE_ACCOUNT,
            payload: id
        });

        dispatch(createMessage({type: "success", title: "Account Deleted"}));
    }).catch(err => dispatch(createMessage({type: "error", title: "Unable to Delete Account!", detail: err})));
};

// GET ACCOUNT DETAILS
export const getAccount = (id) => (dispatch, getState) => {
    dispatch({type: ACCOUNT_LOADING});

    const jwt_token = getState().auth.token

    const config = {
        headers: {
            "Authorization": `bearer ${jwt_token}`
        }
    }

    axios.get(`/api/financial/account/${id}/`, config)
    .then(res => {
        dispatch({type: ACCOUNT_LOADED, payload: res.data});
    }).catch(err => {
        console.log(err);
        dispatch(createMessage({type: "error", title: "Error retrieving account details!"}));
        dispatch({type: ACCOUNT_LOAD_ERROR, payload: err});
    });
}

export const clearAccount = () => (dispatch) => {
    dispatch({
        type: CLEAR_ACCOUNT
    })
}


// GET_FINANCIAL_INSTITUTIONS
export const getInstitutions = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    axios.get('/api/financial/financial_institution/', {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
        dispatch({
            type: GET_FINANCIAL_INSTITUTIONS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(createMessage({type: "error", title: "Error Obtaining Financial Institutions!", detail: err}));
    });
};