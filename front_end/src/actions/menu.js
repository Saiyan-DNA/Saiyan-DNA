import { TOGGLE_NAV_MENU, TOGGLE_USER_MENU } from './types';

export const toggleNavMenu = () => {
    return {
        type: TOGGLE_NAV_MENU
    };
}

export const toggleUserMenu = () => {
    return {
        type: TOGGLE_USER_MENU
    };
}