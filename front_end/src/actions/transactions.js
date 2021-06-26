import axios from 'axios';

import { TRANSACTION_SELECTED, CLEAR_TRANSACTION, TOGGLE_TRANSACTION_MODAL } from './types';
import { TRANSACTIONS_LOADING, TRANSACTIONS_LOADED, CLEAR_TRANSACTIONS } from './types';

import { useHistory } from 'react-router-dom';

// GET ACCOUNT Transactions
export const getTransactions = (acct_id, startDate, endDate) => (dispatch, getState) => {
    if (acct_id) {
        const jwt_token = getState().auth.token

        dispatch({type: TRANSACTIONS_LOADING});

        const config = {
            headers: {
                "Authorization": `bearer ${jwt_token}`
            }
        }

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