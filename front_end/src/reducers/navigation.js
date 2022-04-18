import { SET_TITLE, USER_NAV, USER_HOME, TOGGLE_HOME_MODAL, TOGGLE_TIMEOUT_MODAL } from '../actions/types.js';
import { CHANGE_DATE_RANGE, CHANGE_MONTH, CLEAR_HOME } from '../actions/types.js';

import { addDays } from '../utils/dateutils';

const initialState = {
    headerTitle: "Home Central",
    currentPath: localStorage.getItem("path") || "/",
    selectedHome: {},
    selectedMonth: localStorage.getItem("selectedMonth") || "",
    selectedStartDate: addDays(new Date(), -7),
    selectedEndDate: new Date(),
    homeModalOpen: false,
    timeoutModalOpen: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_TITLE:
            return {
                ...state,
                headerTitle: action.payload
            };
        case USER_NAV:
            localStorage.setItem("path", action.payload);
            return {
                ...state,
                currentPath: action.payload
            };
        case USER_HOME:
            localStorage.setItem("homeId", action.payload.id)
            return {
                ...state,
                selectedHome: action.payload
            };
        case CHANGE_DATE_RANGE:
            return {
                ...state,
                selectedStartDate: action.payload.startDate,
                selectedEndDate: action.payload.endDate
            };
        case CHANGE_MONTH:
            localStorage.setItem("selectedMonth", action.payload, {expires: 1});
            return {
                ...state,
                selectedMonth: action.payload
            };
        case CLEAR_HOME:
            localStorage.removeItem("home");
            return {
                ...state,
                selectedHome: { name: ""}
            };
        case TOGGLE_HOME_MODAL:
            return {
                ...state,
                homeModalOpen: !state.homeModalOpen
            };
        case TOGGLE_TIMEOUT_MODAL:
            return {
                ...state,
                timeoutModalOpen: !state.timeoutModalOpen
            };
        default:
            return state;
    }
}
