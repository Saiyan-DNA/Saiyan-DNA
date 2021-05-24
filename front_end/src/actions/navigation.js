import { SET_TITLE, USER_NAV, USER_HOME } from './types';

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