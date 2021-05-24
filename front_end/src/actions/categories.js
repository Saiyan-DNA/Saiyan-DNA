import axios from 'axios';

import { GET_CATEGORIES, GET_CATEGORY, CLEAR_CATEGORY } from './types';
import { createMessage } from './messages';

// GET CATEGORIES - Tree of Categories
export const getCategories = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const home_id = getState().navigation.currentHome.id;

    axios.get(`/api/inventory/categories?home=${home_id}`, {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
        dispatch(createMessage({categoriesRetrieved: "Categories Retrieved"}));
        dispatch({
            type: GET_CATEGORIES,
            payload: res.data
        });
    }).catch(err => console.log(err));
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