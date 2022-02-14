import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Autocomplete, TextField } from '@mui/material';

class AccountTypeSelect extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,        
        selection: PropTypes.object,
        onChange: PropTypes.func,
        onBlur: PropTypes.func          
    }

    typeSelected = (option, value) => {
        if (option.value === value.value) {
            return true
        }
        return false;
    }

    render() {
        const { id, name, label, onChange, onBlur, selection } = this.props;

        const accountTypes = [
            {value: "CK", label: "Checking"},
            {value: "SV", label: "Savings"},
            {value: "CR", label: "Credit Card"},
            {value: "IN", label: "Investment"},
            {value: "LN", label: "Loan"}
        ];
        
        return (
            <Autocomplete id={id} name={name}
                fullWidth={true} 
                options={accountTypes}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => this.typeSelected(option, value)}
                value={selection} onBlur={onBlur}
                onChange={onChange}                
                renderInput={(params) => <TextField {...params} label={label || "Account Type"} variant="standard" />}>
            </Autocomplete>
        )
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { })(AccountTypeSelect);