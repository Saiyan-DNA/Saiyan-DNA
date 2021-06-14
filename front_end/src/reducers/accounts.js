import { GET_ACCOUNTS, GET_ACCOUNT, CREATE_ACCOUNT, UPDATE_ACCOUNT, CLEAR_ACCOUNT, DELETE_ACCOUNT } from '../actions/types.js';
import { GET_TRANSACTIONS, CLEAR_TRANSACTIONS, GET_FINANCIAL_CATEGORIES, GET_FINANCIAL_INSTITUTIONS } from '../actions/types.js'
import { ACCOUNTS_LOADING, ACCOUNTS_LOADED } from '../actions/types.js'


const initialState = {
    accountsLoading: false,
    accountsLoaded: false,
    accounts: [],
    currentAccount: {},
    accountTransactions: [],
    financialCategories: [],
    financialInstitutions: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ACCOUNTS_LOADING:
            return {
                ...state,
                accounts: [],
                accountsLoading: true,
                accountsLoaded: false
            }
        case ACCOUNTS_LOADED:
            return {
                ...state,
                accounts: action.payload,
                accountsLoading: false,
                accountsLoaded: true
            };
        case DELETE_ACCOUNT:
            return {
                ...state,
                accounts: state.accounts.filter(account => account.id !== action.payload),
                currentAccount: {},
                accountsLoaded: false
            };
        case CREATE_ACCOUNT:
            return {
                ...state,
                currentAccount: action.payload,
                accountsLoaded: false
            };
        case UPDATE_ACCOUNT:
            return {
                ...state,
                currentAccount: action.payload
            };
        case GET_ACCOUNT:
            return {
                ...state,
                currentAccount: action.payload
            };
        case GET_TRANSACTIONS: {
            return {
                ...state,
                accountTransactions: action.payload
            };
        }
        case CLEAR_TRANSACTIONS: {
            return {
                ...state,
                accountTransactions: []
            };
        }
        case CLEAR_ACCOUNT:
            return {
                ...state,
                currentAccount: {}
            };
        case GET_FINANCIAL_CATEGORIES:
            return {
                ...state,
                financialCategories: action.payload
            };
        case GET_FINANCIAL_INSTITUTIONS:
            return {
                ...state,
                financialInstitutions: action.payload
            };
        default:
            return state;
    }
}
