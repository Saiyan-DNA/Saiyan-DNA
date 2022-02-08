import axios from 'axios';

import { GET_ITEMS, DELETE_ITEM, CREATE_ITEM } from './types';
import { createMessage } from './messages';

// GET ITEMS
export const getItems = () => (dispatch, getState) => {
    const jwt_token = getState().auth.token;
    const home_id = getState().navigation.selectedHome.id;

    axios.get(`/api/inventory/item/?home=${home_id}`, {
        headers: {
          'Authorization': `Bearer ${jwt_token}`
        }}).then(res => {
        dispatch(createMessage({itemsRetrieved: "Items Retrieved"}));

        dispatch({
            type: GET_ITEMS,
            payload: res.data
        });
    }).catch(err => console.log(err));
};

// DELETE ITEM
export const deleteItem = (id) => dispatch => {
    console.log("Deleting Item: " + id);

    axios.delete(`/api/inventory/${id}/`)
    .then(res => {
        dispatch({
            type: DELETE_ITEM,
            payload: id
        });
    }).catch(err => console.log(err));
};