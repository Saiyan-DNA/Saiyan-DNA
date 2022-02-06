import { ORGANIZATIONS_LOADING, ORGANIZATIONS_LOADED, ORGANIZATIONS_LOAD_ERROR } from '../actions/types';
import { ORGANIZATION_LOADING, ORGANIZATION_LOADED, CLEAR_ORGANIZATION } from '../actions/types';
import { CREATE_ORGANIZATION, UPDATE_ORGANIZATION, DELETE_ORGANIZATION, SAVE_ORGANIZATION } from '../actions/types';

const initialState = {
    organizations: [],
    organizationsLoaded: false,
    organizationsLoading: false,
    currentOrganization: null,
    organizationLoading: false,
    organizationLoaded: false,
    organizationSaving: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ORGANIZATIONS_LOADING:
            return {
                ...state,
                organizations: [],
                organizationsLoaded: false,
                organizationsLoading: true
            };
        case ORGANIZATIONS_LOADED:
            return {
                ...state,
                organizations: action.payload,
                organizationsLoaded: true,
                organizationsLoading: false
            };
        case ORGANIZATIONS_LOAD_ERROR:
            return {
                ...state,
                organizations: [],
                organizationsLoaded: false,
                organizationsLoading: false
            }
        case ORGANIZATION_LOADING:
            return {
                ...state,
                currentOrganization: null,
                organizationLoading: true,
                organizationLoaded: false
            };
        case ORGANIZATION_LOADED:
            return {
                ...state,
                currentOrganization: action.payload,
                organizationLoading: false,
                organizationLoaded: true
            };
        case CREATE_ORGANIZATION:
            return {
                ...state,
                currentOrganization: action.payload,
                organizationsLoaded: false,
                organizationsLoading: false,
                organizationSaving: false,
            };
        case UPDATE_ORGANIZATION:
            return {
                ...state,
                currentOrganization: action.payload,
                organizationsLoaded: false,
            };
        case DELETE_ORGANIZATION:
            return {
                ...state,
                organizations: state.organizations.filter(org => org.id !== action.payload),
                currentOrganization: null
            };
        case CLEAR_ORGANIZATION:
            return {
                ...state,
                currentOrganization: null,
                organizationLoaded: false,
                organizationLoading: false
            };
        case SAVE_ORGANIZATION:
            return {
                ...state,
                organizationSaving: true
            };
        default:
            return state;
    }
}
