import { CHANGE_DATE_RANGE, CHANGE_MONTH, SET_TITLE, USER_NAV, USER_HOME } from './types';
import { TOGGLE_HOME_MODAL, TOGGLE_TIMEOUT_MODAL } from './types';

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

export const changeDateRange = (startDate, endDate) => {
    return {
        type: CHANGE_DATE_RANGE,
        payload: {startDate: startDate, endDate: endDate}
    }
}

export const changeMonth = (month) => {
    return {
        type: CHANGE_MONTH,
        payload: month
    }
}

export const toggleHomeModal = () => {
    return {
        type: TOGGLE_HOME_MODAL
    };
}

export const toggleTimeoutModal = () => {
    return {
        type: TOGGLE_TIMEOUT_MODAL
    };
}