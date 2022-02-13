import axios from 'axios';

import { CREDIT_REPORTS_LOADING, CREDIT_REPORTS_LOADED, CREDIT_REPORTS_LOAD_ERROR } from './types';
import { CREDIT_REPORT_LOADING, CREDIT_REPORT_LOADED, CREDIT_REPORT_LOAD_ERROR } from './types';
import { CREDIT_REPORT_SAVING, CREDIT_REPORT_SAVED, CREDIT_REPORT_SAVE_ERROR } from './types';
import { CREDIT_REPORT_DELETING, CREDIT_REPORT_DELETED, CREDIT_REPORT_DELETE_ERROR } from './types';

import { createMessage } from './messages';

// GET CATEGORIES - Tree of Categories
export const getCreditReports = () => (dispatch, getState) => {
    const jwtToken = getState().auth.token;

    dispatch({type: CREDIT_REPORTS_LOADING});

    axios.get(`/api/financial/credit_report/`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }}).then(res => {
        dispatch({
            type: CREDIT_REPORTS_LOADED,
            payload: res.data
        });
    }).catch(err => dispatch({type: CREDIT_REPORTS_LOAD_ERROR, payload: err}));
}

// GET CATEGORY DETAILS
export const getCategory = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token

    const config = {
        headers: {
            "Authorization": `bearer ${jwt_token}`
        }
    }

    axios.get(`/api/inventory/category/${id}`, config)
    .then(res => {
        dispatch({
            type: GET_CATEGORY,
            payload: res.data
        });
    }).catch(err => console.log(err));
}

export const clearCategory = () => (dispatch) => {
    dispatch({
        type: CLEAR_CATEGORY
    })
}