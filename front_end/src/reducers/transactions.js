import { TRANSACTION_SELECTED, CLEAR_TRANSACTION, TOGGLE_TRANSACTION_MODAL } from '../actions/types';
import { TRANSACTIONS_LOADING, TRANSACTIONS_LOADED, CLEAR_TRANSACTIONS } from '../actions/types';
import { CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION } from '../actions/types';

const initialState = {
    transactionsLoading: false,
    transactionsLoaded: false,
    transactions: null,
    currentTransaction: null,
    transactionModalOpen: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case TRANSACTIONS_LOADING: {
            return {
                ...state,
                transactionsLoading: true,
                transactionsLoaded: false,
                transactions: null,
            }
        }
        case TRANSACTIONS_LOADED: {
            return {
                ...state,
                transactionsLoading: false,
                transactionsLoaded: true,
                transactions: action.payload
            };
        }
        case CLEAR_TRANSACTIONS: {
            return {
                ...state,
                transactionsLoading: false,
                transactionsLoaded: false,
                transactions: null
            };
        }
        case TRANSACTION_SELECTED:
            return {
                ...state,
                currentTransaction: action.payload
            };
        case CREATE_TRANSACTION:
            return {
                ...state,
                currentTransaction: null
            };
        case UPDATE_TRANSACTION:
            return {
                ...state,
                currentTransaction: null
            };
        case DELETE_TRANSACTION:
            return {
                ...state,
                currentTransaction: null,
                transactions: state.transactions.filter(trns => trns.id !== action.payload),
            };
        case CLEAR_TRANSACTION:
            return {
                ...state,
                currentTransaction: null
            };
        case TOGGLE_TRANSACTION_MODAL:
            return {
                ...state,
                transactionModalOpen: !state.transactionModalOpen
            };
        default:
            return state
    }
}
