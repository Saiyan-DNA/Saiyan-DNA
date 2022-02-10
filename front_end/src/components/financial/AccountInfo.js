import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import { Autocomplete, Button, Card, CardContent, Container, Grid, TextField } from '@mui/material';

const DestructiveButton = loadable(() => import('../common/DestructiveButton' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const DeleteAccountModal = loadable(() => import('./DeleteAccountModal' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>});

import { createAccount, updateAccount, getInstitutions } from '../../actions/accounts';
import { setTitle } from '../../actions/navigation';

import { PercentageFormat, CurrencyFormat } from '../common/NumberFormats'

const styles = theme => ({
    numberInput: {
        textAlign: "right"
    },
    deleteButton: {
        marginTop: "0.5em"
    }
});

class AccountInfo extends React.Component {
    state = {
        id: null,
        accountName: null,
        organization: null,
        financialInstitutions: [],
        accountType: null,
        currentBalance: null,
        creditLimit: "",
        interestRate: "",
        owner: null,
        isValid: false,
        deleteModalOpen: false
    }

    static propTypes = {
        account: PropTypes.object,
        financialInstitutions: PropTypes.array.isRequired,
        currentUser: PropTypes.object.isRequired,
        getInstitutions: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired,
        updateAccount: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { getInstitutions, setTitle, account } = this.props;

        getInstitutions();

        if(account.id) {
            setTitle("Edit Account");

            this.setState({
                id: account.id,
                accountName: account.name,
                organization: account.organization,
                accountType: account.account_type,
                currentBalance: account.current_balance,
                creditLimit: account.credit_limit,
                interestRate: account.interest_rate,
                owner: account.owner,
            })
        } else {
            setTitle("Add Account");
        }
    } 

    validateAccount = (accountInfo) => {
        var isValid = true;

        if (accountInfo.name && accountInfo.name.length == 0) isValid = false;
        if (!accountInfo.accountType) isValid = false;
        if (!accountInfo.organization) isValid = false;
        if (accountInfo.accountType && accountInfo.accountType == "CR") {
            if (!accountInfo.creditLimit) isValid = false;
        }

        return isValid;
    }

    onChange = (e) => {
        var currentState = this.state;

        currentState[e.target.name] = e.target.value;
        currentState.isValid = this.validateAccount(currentState);

        this.setState(currentState);
    }

    accountTypeSelected = (option, selection) => {
        if (selection && option.value == selection.value) {
            return true;
        }
        return false;
    }

    institutionSelected = (option, selection) => {
        if (selection && option.id == selection.id) {
            return true;
        }
        return false;
    }

    creditFields = (classes) => {
        const { creditLimit, interestRate } = this.state;

        return (
            <>
                <Grid item xs={6}>
                    <TextField id="creditLimit" name="creditLimit"
                        label="Credit Limit*" variant="standard"
                        className={classes.numberInput}
                        onChange={this.onChange.bind(this)} 
                        value={creditLimit} 
                        fullWidth={true} InputProps={{inputComponent: CurrencyFormat,}} /> 
                </Grid>
                <Grid item xs={6}>
                    <TextField id="interestRate" name="interestRate"
                        label="Interest Rate*" variant="standard"
                        onChange={this.onChange.bind(this)}
                        value={interestRate}
                        fullWidth={true} InputProps={{inputComponent: PercentageFormat,}} />
                </Grid>
            </>
        );
    }

    toggleDeleteModal = () => {
        this.setState({deleteModalOpen: !this.state.deleteModalOpen});
    }

    saveAccountDetails = () => {
        const { currentUser, createAccount, updateAccount, history } = this.props;
        const { id, accountName, accountType, organization, currentBalance, creditLimit, interestRate } = this.state

        let accountObject = {
            "name": accountName,
            "account_type": accountType,
            "organization": organization.id,
            "current_balance": parseFloat(currentBalance) || 0.00,
            "credit_limit": parseFloat(creditLimit) || 0.00,
            "interest_rate": (parseFloat(interestRate) || 0),
            "owner": currentUser.id
        }

        id ? updateAccount(id, accountObject) : createAccount(accountObject);

        history.push("/financial/accountoverview");
    }

    render() {
        const { classes, financialInstitutions, history } = this.props;
        const { id, accountName, accountType, organization, currentBalance, isValid, deleteModalOpen } = this.state;

        const accountTypes = [
            {value: "CK", label: "Checking"},
            {value: "SV", label: "Savings"},
            {value: "CR", label: "Credit Card"},
            {value: "IN", label: "Investment"},
            {value: "LN", label: "Loan"}
        ];

        return (
            <Container>
                <form onSubmit={this.saveAccountDetails}>
                    <Grid container spacing={3} justifyContent="space-between">
                        <Grid item>
                            <Button color="primary" variant="outlined" size="small"
                                onClick={history.goBack}>Back</Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary" variant="contained" size="small" disabled={!isValid}
                                onClick={this.saveAccountDetails}>Save</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={4}>
                                <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField id="accountName" name="accountName" label="Account Name" variant="standard"
                                                    required fullWidth={true} value={accountName || ""} onChange={this.onChange} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete id="accountType" name="accountType"
                                                    fullWidth={true} 
                                                    options={accountTypes}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) => this.accountTypeSelected(option, value)}
                                                    value={accountTypes.filter(acctType => {return acctType.value == accountType})[0] || null}
                                                    onChange={(event, selection) => {if (selection) this.onChange({target: {name: "accountType", value: selection.value}})}}
                                                    renderInput={props => <TextField {...props} label="Account Type*" variant="standard" />}>
                                                </Autocomplete>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete id="organization" name="organization"
                                                    fullWidth={true} 
                                                    options={financialInstitutions || []}
                                                    getOptionLabel={(option) => option.name}
                                                    isOptionEqualToValue={(option, value) => this.institutionSelected(option, value)}
                                                    value={organization || null}
                                                    onChange={(event, value) => this.onChange({target: {name: "organization", value: value}})}
                                                    renderInput={(props) => <TextField {...props} label="Financial Institution*" variant="standard" />}>
                                                </Autocomplete>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField id="currentBalance" name="currentBalance"
                                                    label="Balance" variant="standard"
                                                    className={classes.numberInput}
                                                    onChange={this.onChange.bind(this)} 
                                                    value={currentBalance} 
                                                    fullWidth={true} InputProps={{inputComponent: CurrencyFormat,}}/> 
                                            </Grid>
                                            { accountType === "CR" ? this.creditFields(classes) : null }
                                        </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        {!id ? null : 
                            <Grid item xs={6}>
                                <DestructiveButton
                                    onClick={this.toggleDeleteModal}>Delete Account</DestructiveButton>
                            </Grid>
                        }
                    </Grid>
                </form>
                {!id ? null :
                    <DeleteAccountModal open={deleteModalOpen} onClose={this.toggleDeleteModal} 
                        id={id} accountName={accountName} organization={organization} />
                }
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    account: state.accounts.currentAccount,
    financialInstitutions: state.accounts.financialInstitutions
});

const mapDispatchToProps = {
    createAccount,
    updateAccount,
    getInstitutions,
    setTitle,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AccountInfo));