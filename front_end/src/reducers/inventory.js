import { GET_CATEGORIES, GET_CATEGORY, CLEAR_CATEGORY } from '../actions/types.js';

const initialState = {
    categories: [],
    parentCategories: [],
    currentCategory: null,
    items: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            };
        case GET_CATEGORY:
            return {
                ...state,
                currentCategory: action.payload
            };
        case CLEAR_CATEGORY:
            return {
                ...state,
                currentCategory: null
            };
        default:
            return state;
    }
}
