import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

const AutoComplete = loadable(() => import('@material-ui/lab/Autocomplete' /* webpackChunkName: "Material" */));
const TextField = loadable(() => import('@material-ui/core/TextField' /* webpackChunkName: "Material" */));

class AccountSelect extends React.Component {
    static propTypes = {
        accounts: PropTypes.array.isRequired,
        id: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,        
        selection: PropTypes.object,
        disabledAccount: PropTypes.object,
        onChange: PropTypes.func,
        onBlur: PropTypes.func          
    }

    componentDidMount() {

    }

    accountSelected = (option, value) => {
        if (option.id == value.id) {
            return true
        }
        return false;
    }

    render() {
        const { id, name, label, accounts, onChange, onBlur, selection, disabledAccount } = this.props;

        var filteredAccounts = null;
        if (disabledAccount) filteredAccounts = accounts.filter(acct => acct.id != disabledAccount.id);
        else filteredAccounts = accounts;

        return (
            <AutoComplete id={id} name={name}
                fullWidth={true} 
                options={filteredAccounts ? filteredAccounts.sort((a, b) => a.name.localeCompare(b.name)) : []}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) => this.accountSelected(option, value)}
                value={selection} onBlur={onBlur}
                onChange={(event, value) => onChange({target: {name: name, value: value}})}                
                renderInput={(params) => <TextField {...params} label={label || "Account"} variant="standard" />}>
            </AutoComplete>
        )
    }

}

const mapStateToProps = state => ({
    accounts: state.accounts.accounts
});

export default connect(mapStateToProps, {  })(AccountSelect);