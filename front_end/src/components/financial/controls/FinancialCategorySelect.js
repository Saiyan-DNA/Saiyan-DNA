import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Autocomplete, TextField } from '@mui/material';

import { getFinancialCategories } from '../../../actions/financial_categories';

class FinancialCategorySelect extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        name: PropTypes.string,
        getFinancialCategories: PropTypes.func.isRequired,
        financialCategories: PropTypes.array.isRequired,
        selection: PropTypes.object,
        onChange: PropTypes.func,
        onBlur: PropTypes.func            
    }

    componentDidMount() {
        this.props.getFinancialCategories();
    }

    categorySelected = (option, value) => {
        if (option.id == value.id) {
            return true
        }
        return false;
    }

    render() {
        const { id, name, financialCategories, onChange, selection } = this.props;
        
        return (
            <Autocomplete id={id || "transactionCategory"} name={name || "transactionCategory"}
                fullWidth={true} 
                options={financialCategories ? financialCategories.sort((a, b) => a.path_name.localeCompare(b.path_name)) : []}
                getOptionLabel={(option) => option.path_name}
                isOptionEqualToValue={(option, value) => this.categorySelected(option, value)}
                value={selection}
                onChange={(event, value) => onChange({target: {name: name || "transactionCategory", value: value}})}
                renderInput={(params) => <TextField {...params} label="Category" variant="standard" />}>
            </Autocomplete>
        )
    }

}

const mapStateToProps = state => ({
    financialCategories: state.accounts.financialCategories
});

export default connect(mapStateToProps, { getFinancialCategories })(FinancialCategorySelect);