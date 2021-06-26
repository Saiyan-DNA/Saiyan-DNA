import { combineReducers } from 'redux';
import accounts from './accounts';
import assets from './assets';
import auth from './auth';
import email from './email';
import homes from './homes';
import inventory from './inventory';
import items from './items';
import menu from './menu';
import messages from './messages';
import navigation from './navigation';
import transactions from './transactions';

import { LOGOUT_SUCCESS, LOGIN_FAIL } from '../actions/types';

const appReducer = combineReducers({
    accounts,
    assets,
    auth,
    email,
    homes,
    inventory,
    items,
    menu,
    messages,
    navigation,
    transactions    
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT_SUCCESS || action.type === LOGIN_FAIL ) {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;