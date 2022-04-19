import axios from 'axios';

import { GET_FINANCIAL_CATEGORIES } from './types';
import { createMessage } from './messages';

// GET CATEGORIES - Tree of Categories
export const getFinancialCategories = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const home_id = getState().navigation.selectedHome.id;

    axios.get(`/api/financial/category?home=${home_id}`, {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
        dispatch({
            type: GET_FINANCIAL_CATEGORIES,
            payload: res.data
        });
    }).catch(err => console.log(err));
}

// GET CATEGORY DETAILS
export const getCategory = (id) => (dispatch, getState) => {
    const jwt_token = getState().auth.token

    const config = {
        headers: {
            "Authorization": `Bearer ${jwt_token}`
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