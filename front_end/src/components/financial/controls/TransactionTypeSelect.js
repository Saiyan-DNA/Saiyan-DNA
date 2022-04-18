import React from 'react';
import { connect } from 'react-redux';

import { Autocomplete, TextField } from '@mui/material';

import { getFinancialCategories } from '../../../actions/financial_categories';

class TransactionTypeSelect extends React.Component {
    state = {
        transactionTypes: [
            {id: "CRD", name: "Credit"},
            {id: "DBT", name: "Debit"},
            {id: "TRN", name: "Transfer"}
        ]
    }

    typeSelected = (option, value) => {
        if (option.id === value) {
            return true
        }
        return false;
    }

    getLabel = (option) => {
        return option.name || this.state.transactionTypes.filter(t => t.id === option)[0].name;
    }

    render() {
        const { id, name, onChange, selection } = this.props;
        const { transactionTypes } = this.state;
        
        return (
            <Autocomplete id={id || "transactionType"} name={name || "transactionType"}
                fullWidth={true} 
                options={transactionTypes}
                getOptionLabel={(option) => this.getLabel(option)}
                isOptionEqualToValue={(option, value) => this.typeSelected(option, value)}
                value={selection}
                onChange={(event, value) => onChange({target: {name: name || "transactionType", value: value.id}})}
                renderInput={(params) => <TextField {...params} label="Type" variant="standard" />}>
            </Autocomplete>
        )
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { getFinancialCategories })(TransactionTypeSelect);