import { GET_ITEMS, DELETE_ITEM, CREATE_ITEM } from '../actions/types.js';

const initialState = {
    items: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ITEMS:
            return {
                ...state,
                accounts: action.payload
            };
        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        default:
            return state;
    }
}
