import { ASSETS_LOADING, ASSETS_LOADED, GET_ASSET, CREATE_ASSET, UPDATE_ASSET, CLEAR_ASSET, DELETE_ASSET } from '../actions/types.js';

const initialState = {
    assets: [],
    currentAsset: null,
    assetsLoaded: false,
    assetsLoading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ASSETS_LOADED:
            return {
                ...state,
                assets: action.payload,
                assetsLoading: false,
                assetsLoaded: true
            };
        case ASSETS_LOADING:
            return {
                ...state,
                assets: [],
                assetsLoading: true,
                assetsLoaded: false
            };
        case DELETE_ASSET:
            return {
                ...state,
                assets: state.assets.filter(asset => asset.id !== action.payload),
                currentAsset: null
            };
        case CREATE_ASSET:
        case UPDATE_ASSET:
            return {
                ...state,
                currentAsset: action.payload
            };
        case GET_ASSET:
            return {
                ...state,
                currentAsset: action.payload
            };
        case CLEAR_ASSET:
            return {
                ...state,
                currentAsset: null
            };
        default:
            return state;
    }
}
