import { SET_TITLE, USER_NAV, USER_HOME, TOGGLE_HOME_MODAL } from './types';

export const setTitle = (title) => {
    return {
        type: SET_TITLE,
        payload: title
    }
}

export const userNav = (path) => {
    return {
        type: USER_NAV,
        payload: path
    }
}

export const setHome = (home) => {
    return {
        type: USER_HOME,
        payload: home
    }
}

export const toggleHomeModal = () => {
    return {
        type: TOGGLE_HOME_MODAL
    };
}