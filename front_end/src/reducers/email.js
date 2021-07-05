import { SENDING_EMAIL, EMAIL_SUCCESS, EMAIL_ERROR } from '../actions/types';

const initialState = {
    isSending: false,
    showSuccess: false,
    showError: false,
    errorMessage: ""
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SENDING_EMAIL:
            return {
                ...state,
                isSending: true
            }
        case EMAIL_SUCCESS:
            return {
                ...state,
                showSuccess: true,
                showError: false,
                isSending: false,                
            }
        case EMAIL_ERROR:
            return {
                ...state,
                showError: true,
                showSuccess: false,
                isSending: false,
                errorMessage: action.payload
            }
        default:
            return state;
    }
}