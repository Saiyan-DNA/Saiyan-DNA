import { ACCOUNT_LOADING, ACCOUNT_LOADED, ACCOUNT_LOAD_ERROR, CLEAR_ACCOUNT, ACCOUNT_DELETING } from '../actions/types';
import { CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../actions/types';
import { GET_FINANCIAL_CATEGORIES, GET_FINANCIAL_INSTITUTIONS } from '../actions/types';
import { ACCOUNTS_LOADING, ACCOUNTS_LOADED, ACCOUNTS_LOAD_ERROR } from '../actions/types';

const initialState = {
    accountsLoading: false,
    accountsLoaded: false,
    accounts: [],
    currentAccount: {},
    accountLoading: false,
    accountLoaded: false,
    accountLoadError: false,
    accountDeleting: false,
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
        case ACCOUNTS_LOAD_ERROR:
            return {
                ...state,
                accounts: [],
                accountsLoading: false,
                accountsLoaded: false
            }
        case ACCOUNT_DELETING:
            return {
                ...state,
                accountDeleting: true
            }
        case DELETE_ACCOUNT:
            return {
                ...state,
                accounts: state.accounts.filter(account => account.id !== action.payload),
                currentAccount: {},
                accountsLoaded: false,
                accountDeleting: false
            };
        case CREATE_ACCOUNT:
            return {
                ...state,
                currentAccount: action.payload,
                accountLoading: false,
                accountLoaded: true,
                accountLoadError: false,
                accountsLoaded: false
            };
        case UPDATE_ACCOUNT:
            return {
                ...state,
                currentAccount: action.payload,
                accountsLoaded: false
            };
        case ACCOUNT_LOADING:
            return {
                ...state,
                accountLoading: true,
                accountLoaded: false,
                accountLoadError: false,
                currentAccount: {}
            };
        case ACCOUNT_LOADED:
            localStorage.setItem("accountId", action.payload.id);
            return {
                ...state,
                accountLoading: false,
                accountLoaded: true,
                accountLoadError: false,
                currentAccount: action.payload
            };
        case ACCOUNT_LOAD_ERROR:
            localStorage.removeItem("accountId");
            return {
                ...state,
                accountLoading: false,
                accountLoaded: false,
                accountLoadError: true,
                currentAccount: {}
            };
        case CLEAR_ACCOUNT:
            localStorage.removeItem("accountId");
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
