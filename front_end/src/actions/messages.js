import { CREATE_MESSAGE, CLEAR_MESSAGE } from './types'

// CREATE MESSAGE
export const createMessage = msg => {
    return {
        type: CREATE_MESSAGE,
        payload: msg
    };
}

// CLEAR MESSAGE
export const clearMessage = () => {
    return {
        type: CLEAR_MESSAGE
    };
}