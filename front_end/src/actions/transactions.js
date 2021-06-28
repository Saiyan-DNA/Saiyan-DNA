import axios from 'axios';

import { TRANSACTION_SELECTED, CLEAR_TRANSACTION, TOGGLE_TRANSACTION_MODAL } from './types';
import { TRANSACTIONS_LOADING, TRANSACTIONS_LOADED, CLEAR_TRANSACTIONS } from './types';
import { CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION } from './types';

import { createMessage } from './messages';

// GET ACCOUNT Transactions
export const getTransactions = (acct_id, startDate, endDate) => (dispatch, getState) => {
    if (acct_id) {
        const jwt_token = getState().auth.token;

        dispatch({type: TRANSACTIONS_LOADING});

        const config = {
            headers: {
                "Authorization": `bearer ${jwt_token}`
            }
        };

        axios.get(`/api/financial/transaction/?acct_id=${acct_id}`, config)
        .then(res => {
            dispatch({
                type: TRANSACTIONS_LOADED,
                payload: res.data
            });
        }).catch(err => console.log(err));
    } else {
        console.log('No Account specified to obtain transactions.')
    }
}

export const createTransaction = (transactionDetails) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const account = getState().accounts.currentAccount;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.post('/api/financial/transaction/', JSON.stringify(transactionDetails), config)
    .then(res => {
        dispatch({type: CREATE_TRANSACTION, payload: res.data});
        dispatch(getTransactions(account.id));
        dispatch(createMessage({type: "success", title: "Added Transaction"}));
    }).catch(err => {
        dispatch(createMessage({type: "error", title: "Failed to Add Transaction", detail: err}));
    });
}

export const updateTransaction = (transactionDetails) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const account = getState().accounts.currentAccount;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.put(`/api/financial/transaction/${transactionDetails.id}/`, JSON.stringify(transactionDetails), config)
    .then(res => {
        dispatch({type: UPDATE_TRANSACTION, payload: res.data});
        dispatch(getTransactions(account.id));
        dispatch(createMessage({type: "success", title: "Updated Transaction"}));
    }).catch(err => {
        dispatch(createMessage({type: "error", title: "Failed to Update Transaction", detail: err}));
    });
}

// DELETE_TRANSACTION
export const deleteTransaction = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${jwt_token}`
        }
    };

    axios.delete(`/api/financial/transaction/${id}/`, config)
    .then(res => {
        dispatch({
            type: DELETE_TRANSACTION,
            payload: id
        });

        dispatch(createMessage({type: "success", title: "Transaction Deleted"}));
    }).catch(err => dispatch(createMessage({type: "error", title: "Unable to Delete Transaction!", detail: err})));
};

export const clearTransactions = () => (dispatch) => {
    dispatch({
        type: CLEAR_TRANSACTIONS
    });
}

export const toggleTransactionModal = () => (dispatch) => {
    dispatch({
        type: TOGGLE_TRANSACTION_MODAL
    });
}

export const editTransaction = (transactionDetails) => (dispatch, getState) => {
    const isMobile = getState().auth.isMobile;

    if (transactionDetails) {
        dispatch({type: TRANSACTION_SELECTED, payload: transactionDetails});       
    } 

    if (!isMobile) {
        dispatch({type: TOGGLE_TRANSACTION_MODAL});
        return;
    } 
}

export const clearTransaction = () => {
        return {type: CLEAR_TRANSACTION};
}