import React from "react";
import loadable from '@loadable/component';

const FormControl = loadable(() => import('@mui/material/FormControl' /* webpackChunkName: "Material-Input" */));
const InputLabel = loadable(() => import('@mui/material/InputLabel' /* webpackChunkName: "Material-Input" */));
const MenuItem = loadable(() => import('@mui/material/MenuItem' /* webpackChunkName: "Material-Navigation" */));
const Select = loadable(() => import('@mui/material/Select' /* webpackChunkName: "Material-Input" */));

const TransactionTypeSelect = ({value, defaultValue, onChange, onBlur}) => {
    return (
        <FormControl fullWidth={true}>
            <InputLabel htmlFor="transactionType">Type</InputLabel>
            <Select id="transactionType" name="transactionType" fullWidth={true} 
                onChange={onChange} 
                onBlur={onBlur}
                value={value}
                defaultValue={defaultValue}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="CRD">Credit</MenuItem>
                    <MenuItem value="DBT">Debit</MenuItem>
                    <MenuItem value="TRN">Transfer</MenuItem>
            </Select>
        </FormControl>
    );
}

export default TransactionTypeSelect