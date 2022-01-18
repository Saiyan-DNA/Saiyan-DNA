import { NET_WORTH_LOADING, NET_WORTH_LOADED, NET_WORTH_LOAD_ERROR, RESET_NET_WORTH } from '../actions/types';

const initialState = {
    netWorthLoading: false,
    netWorthLoaded: false,
    netWorthData: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case NET_WORTH_LOADING:
            return {
                ...state,
                netWorthLoading: true,
                netWorthLoaded: false,
                netWorthData: {}
            };
        case NET_WORTH_LOADED:
            return {
                ...state,
                netWorthData: action.payload,
                netWorthLoading: false,
                netWorthLoaded: true
            };
        case NET_WORTH_LOAD_ERROR:
            return {
                ...state,
                netWorthLoading: false,
                netWorthLoaded: false,
                netWorthData: {}
            };
        case RESET_NET_WORTH:
            return {
                ...state,
                netWorthLoading: false,
                netWorthLoaded: false,
                netWorthData: {}
            }
        default:
            return state;
    }
}
