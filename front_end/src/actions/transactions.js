import axios from 'axios';

import { TRANSACTION_SELECTED, CLEAR_TRANSACTION, TOGGLE_TRANSACTION_MODAL } from './types';
import { TRANSACTIONS_LOADING, TRANSACTIONS_LOADED, CLEAR_TRANSACTIONS } from './types';
import { CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION } from './types';

import { createMessage } from './messages';
import { getAccounts, getAccount } from './accounts';

// GET ACCOUNT Transactions
export const getTransactions = (acct_id) => (dispatch, getState) => {
    if (acct_id) {
        const jwt_token = getState().auth.token;
        var start_date = getState().navigation.selectedStartDate;
        var end_date = getState().navigation.selectedEndDate

        start_date.setHours(0,0,0,0);
        end_date.setHours(23,59,59,999);
        start_date = start_date.toISOString();
        end_date = end_date.toISOString();

        dispatch({type: TRANSACTIONS_LOADING});

        const config = {
            headers: {
                "Authorization": `Bearer ${jwt_token}`
            }
        };

        axios.get(`/api/financial/transaction/?acct_id=${acct_id}&start_date=${start_date}&end_date=${end_date}`, config)
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

export const createTransfer = (transferDetail) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const account = getState().accounts.currentAccount;
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt_token}`
        }
    };

    axios.post('/api/financial/transfer/', JSON.stringify(transferDetail), config)
    .then(res => {
        dispatch({type: CREATE_TRANSACTION});
        dispatch(getTransactions(account.id));
        dispatch(createMessage({type: "success", title: "Added Transfer Transaction"}));
    }).catch(err => {
        dispatch(createMessage({type: "error", title: "Failed to Create Transfer", detail: err}));
    });
}

export const createTransaction = (transactionDetails, transferDetail) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const account = getState().accounts.currentAccount;
    const owner = getState().auth.user;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt_token}`
        }
    };

    // Use the Transaction API if the transaction is NOT of type "TRN"
    if (!transferDetail) {
        axios.post('/api/financial/transaction/', JSON.stringify(transactionDetails), config)
        .then(res => {
            dispatch({type: CREATE_TRANSACTION, payload: res.data});

            // Refresh Accounts to reflect the change in balance
            dispatch(getAccounts());
            dispatch(getAccount(account.id));
            dispatch(getTransactions(account.id));

            dispatch(createMessage({type: "success", title: "Added Transaction"}));
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Failed to Add Transaction", detail: err}));
        });

        return
    }

    // Use the Transfer API if the transaction is of type "TRN" and Transfer Detail information is provided.
    if (transactionDetails.transaction_type == "TRN" && transferDetail) {
        axios.post('/api/financial/transfer/', JSON.stringify({transaction: transactionDetails, transfer_detail: transferDetail}), config)
        .then(res => {
            dispatch({type: CREATE_TRANSACTION, payload: res.data});
            
            // Refresh Accounts to reflect the change in balance
            dispatch(getAccounts());
            dispatch(getAccount(account.id));
            dispatch(getTransactions(account.id));

            dispatch(createMessage({type: "success", title: "Added Transfer Transaction"}));
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Failed to Add Transaction", detail: err}));
        });
    }
}

export const updateTransaction = (transactionDetails, transferDetail) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const account = getState().accounts.currentAccount;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt_token}`
        }
    };

    if (!transferDetail) {
        axios.put(`/api/financial/transaction/${transactionDetails.id}/`, JSON.stringify(transactionDetails), config)
        .then(res => {
            dispatch({type: UPDATE_TRANSACTION, payload: res.data});
            
            // Refresh Accounts to reflect the change in balance
            dispatch(getAccounts());
            dispatch(getAccount(account.id));
            dispatch(getTransactions(account.id));

            dispatch(createMessage({type: "success", title: "Updated Transaction"}));
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Failed to Update Transaction", detail: err}));
        });
    }

    if (transactionDetails.transaction_type == "TRN" && transferDetail) {
        axios.put('/api/financial/transfer/', JSON.stringify({transaction: transactionDetails, transfer_detail: transferDetail}), config)
        .then(res => {
            dispatch({type: CREATE_TRANSACTION, payload: res.data});
            
            // Refresh Accounts to reflect the change in balance
            dispatch(getAccounts());
            dispatch(getAccount(account.id));
            dispatch(getTransactions(account.id));

            dispatch(createMessage({type: "success", title: "Updated Transfer Transaction"}));
        }).catch(err => {
            dispatch(createMessage({type: "error", title: "Failed to Update Transaction", detail: err}));
        });
    }
}

// DELETE_TRANSACTION
export const deleteTransaction = (transaction) => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const account = getState().accounts.currentAccount;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt_token}`
        }
    };

    // Use the Transfer API if the transaction is of type "TRN"
    if (transaction.transactionType == "TRN") {
        axios.delete(`/api/financial/transfer/?transaction_id=${transaction.transactionId}`, config)
        .then(res => {
            dispatch({type: DELETE_TRANSACTION, payload: transaction.transactionId});

            // Refresh Accounts to reflect the change in balance
            dispatch(getAccounts());
            dispatch(getAccount(account.id));

            dispatch(createMessage({type: "success", title: "Transaction Deleted"}));
        }).catch(err => dispatch(createMessage({type: "error", title: "Unable to Delete Transfer!", detail: err})));
        return;
    }

    // Use the Transaction API if the transaction is of any other type (Credit, Debit)
    axios.delete(`/api/financial/transaction/${transaction.transactionId}/`, config)
    .then(res => {
        dispatch({type: DELETE_TRANSACTION, payload: transaction.transactionId});

        // Refresh Accounts to reflect the change in balance
        dispatch(getAccounts());
        dispatch(getAccount(account.id));

        dispatch(createMessage({type: "success", title: "Transaction Deleted"}));
        return;
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