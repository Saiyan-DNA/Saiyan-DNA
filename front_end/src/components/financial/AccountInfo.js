import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Button, Card, CardContent, Container, Grid, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';

const CurrencyFormat = loadable(() => import('../common/CurrencyFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const PercentageFormat = loadable(() => import('../common/PercentageFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const OrganizationSelect = loadable(() => import('../common/OrganizationSelect' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const DestructiveButton = loadable(() => import('../common/DestructiveButton' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});

const AccountTypeSelect = loadable(() => import('./controls/AccountTypeSelect' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>});
const DeleteAccountModal = loadable(() => import('./DeleteAccountModal' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>});

import { createAccount, updateAccount } from '../../actions/accounts';
import { userHasPermission} from '../../actions/auth';
import { setTitle } from '../../actions/navigation';

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
        accountType: null,
        currentBalance: null,
        creditLimit: "",
        interestRate: "",
        owner: null,
        isValid: false,
        deleteModalOpen: false,
        balanceEditable: false,
    }

    static propTypes = {
        account: PropTypes.object,
        currentUser: PropTypes.object.isRequired,
        createAccount: PropTypes.func.isRequired,
        updateAccount: PropTypes.func.isRequired,
        userHasPermission: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { setTitle, account, userHasPermission } = this.props;

        var balanceEditable = userHasPermission('can_edit_balance');

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
                balanceEditable: balanceEditable
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
        if (accountInfo.accountType && accountInfo.accountType.value === 'CR') {
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

    creditFields = (classes) => {
        const { creditLimit, interestRate, accountType } = this.state;

        return (
            <>
                <Grid item xs={6}>
                    <TextField id="creditLimit" name="creditLimit" label={accountType && accountType.value === 'LN' ? 'Loan Amount*' : "Credit Limit*"}
                        variant="standard" value={creditLimit} className={classes.numberInput} fullWidth={true} 
                        onChange={this.onChange.bind(this)} InputProps={{inputComponent: CurrencyFormat,}} /> 
                </Grid>
                <Grid item xs={6}>
                    <TextField id="interestRate" name="interestRate" label="Interest Rate*" variant="standard"
                        value={interestRate} fullWidth={true} onChange={this.onChange.bind(this)} 
                        InputProps={{inputComponent: PercentageFormat,}} />
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
            "account_type": accountType.value,
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
        const { classes, history } = this.props;
        const { id, accountName, accountType, organization, currentBalance, isValid, deleteModalOpen, balanceEditable } = this.state;

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
                                                <AccountTypeSelect id="accountType" name="accountType" selection={accountType} required={true}
                                                    onChange={(event, selection) => {if (selection) this.onChange({target: {name: "accountType", value: selection}})}} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <OrganizationSelect id="organization" name="organization" selection={organization || null} allowAdd={true}
                                                    typeFilter="Financial" label="Financial Institution" variant="standard" required={true} history={this.props.history}
                                                    onChange={(event, value) => this.onChange({target: {name: "organization", value: value}})} />
                                            </Grid>
                                            { balanceEditable &&
                                                <Grid item xs={6}>
                                                    <TextField id="currentBalance" name="currentBalance"
                                                        label="Balance" variant="standard" className={classes.numberInput}
                                                        value={currentBalance} onChange={this.onChange.bind(this)} 
                                                        fullWidth={true} InputProps={{inputComponent: CurrencyFormat,}}/> 
                                                </Grid>
                                            }
                                            { accountType && ['CR', 'LN'].includes(accountType.value) ? this.creditFields(classes) : null }
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
    userHasPermission,
    setTitle,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AccountInfo));