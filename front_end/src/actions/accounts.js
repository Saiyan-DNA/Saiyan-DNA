import axios from 'axios';

import { GET_ACCOUNTS, CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT, GET_ACCOUNT, CLEAR_ACCOUNT } from './types';
import { GET_TRANSACTIONS, CLEAR_TRANSACTIONS } from './types';
import { GET_FINANCIAL_INSTITUTION, GET_FINANCIAL_INSTITUTIONS } from './types';
import { createMessage } from './messages';

// GET_ACCOUNTS
export const getAccounts = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    axios.get('/api/financial/account/', {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
        dispatch(createMessage({accountsRetrieved: "Accounts Retrieved"}));

        dispatch({
            type: GET_ACCOUNTS,
            payload: res.data
        });
    }).catch(err => console.log(err));
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

    axios.post('/api/financial/account/', JSON.stringify(acct), config)
    .then(res => {
        dispatch({
            type: CREATE_ACCOUNT,
            payload: res.data
        });
    }).catch(err => console.log(err));
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
    }).catch(err => console.log(err));
};

// DELETE_ACCOUNT
export const deleteAccount = (id) => (dispatch, getState) => {
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
    }).catch(err => console.log(err));
};

// GET ACCOUNT DETAILS
export const getAccount = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token

    const config = {
        headers: {
            "Authorization": `bearer ${jwt_token}`
        }
    }

    axios.get(`/api/financial/account/${id}/`, config)
    .then(res => {
        dispatch({
            type: GET_ACCOUNT,
            payload: res.data
        });
    }).catch(err => console.log(err));
}

// GET ACCOUNT Transactions
export const getTransactions = (acct_id, startDate, endDate) => (dispatch, getState) => {
    if (acct_id) {
        const jwt_token = getState().auth.token

        const config = {
            headers: {
                "Authorization": `bearer ${jwt_token}`
            }
        }

        axios.get(`/api/financial/transaction/?acct_id=${acct_id}`, config)
        .then(res => {
            dispatch({
                type: GET_TRANSACTIONS,
                payload: res.data
            });
        }).catch(err => console.log(err));
    } else {
        console.log('No Account specified to obtain transactions.')
    }
}

export const clearTransactions = () => (dispatch) => {
    dispatch({
        type: CLEAR_TRANSACTIONS
    })
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
        dispatch(createMessage({institutionsRetrieved: "Financial Institutions Retrieved"}));

        dispatch({
            type: GET_FINANCIAL_INSTITUTIONS,
            payload: res.data
        });
    }).catch(err => console.log(err));
};