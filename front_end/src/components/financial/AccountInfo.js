import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const AutoComplete = loadable(() => import('@material-ui/lab/Autocomplete' /* webpackChunkName: "Material" */));
const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Material" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material" */));
const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material" */));
const TextField = loadable(() => import('@material-ui/core/TextField' /* webpackChunkName: "Material" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material" */));

import BasicModal from '../common/BasicModal';

import { createAccount, updateAccount, deleteAccount } from '../../actions/accounts';
import { setTitle } from '../../actions/navigation';


const styles = theme => ({
    numberInput: {
        textAlign: "right"
    },
    modalMessage: {
        paddingBottom: "1.5em",
        marginBottom: "0.5em",
        borderBottom: "0.1px solid dimgray"
    },
    modalMessageIndented: {
        marginTop: "1em",
        marginLeft: "2em"
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
        creditLimit: null,
        interestRate: null,
        owner: null,
        isValid: false,
        deleteModalOpen: false
    }

    static propTypes = {
        account: PropTypes.object,
        financialInstitutions: PropTypes.array.isRequired,
        currentUser: PropTypes.object.isRequired,
        createAccount: PropTypes.func.isRequired,
        updateAccount: PropTypes.func.isRequired,
        deleteAccount: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired
    }

    componentDidMount() {
        if(this.props.account.id && this.props.financialInstitutions) {
            this.props.setTitle("Edit Account");

            this.setState({
                id: this.props.account.id,
                accountName: this.props.account.name,
                organization: this.props.account.organization,
                accountType: this.props.account.account_type,
                currentBalance: this.props.account.current_balance,
                creditLimit: this.props.account.credit_limit,
                interestRate: this.props.account.interest_rate,
                owner: this.props.account.owner,
            })
        } else {
            this.props.setTitle("Add Account");
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
        return (
            <>
                <Grid item xs={6}>
                    <TextField id="creditLimit" name="creditLimit"
                        label="Credit Limit*"
                        className={classes.numberInput}
                        onChange={this.onChange.bind(this)} 
                        value={this.state.creditLimit}
                        fullWidth={true} InputProps={{inputComponent: this.currencyFormat,}} /> 
                </Grid>
                <Grid item xs={6}>
                    <TextField id="interestRate" name="interestRate"
                        label="Interest Rate*"
                        onChange={this.onChange.bind(this)}
                        value={this.state.interestRate}
                        fullWidth={true} InputProps={{inputComponent: this.percentageFormat,}} />
                </Grid>
            </>
        );
    }

    deleteButton = (styleClasses) => {
        return (
            <Button variant="contained" size="small" color="primary" style={{backgroundColor: "#c62828", marginTop: "0.5em"}}
                onClick={this.toggleDeleteModal}>Delete Account</Button>
        );
    }

    deleteModal = (styleClasses) => {
        return (
            <BasicModal open={this.state.deleteModalOpen} onClose={this.toggleDeleteModal} title="Delete Account?">
                <div className={styleClasses.modalMessage}>
                    <Typography variant="body1">Are you sure you want to delete this account?</Typography>
                    <Typography variant="body2" className={styleClasses.modalMessageIndented}>
                        <>
                            {this.state.accountName}&nbsp;{this.state.organization && "(" + this.state.organization.name + ")"}
                        </>
                    </Typography>
                </div>
                <Grid container spacing={2} justify="flex-end">
                    <Grid item>
                        <Button variant="outlined" color="primary" size="small" onClick={this.toggleDeleteModal}>Cancel</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" size="small" onClick={this.deleteAccount} style={{backgroundColor: "#c62828"}}>Delete</Button>
                    </Grid>
                </Grid>
            </BasicModal>
        );
    }

    toggleDeleteModal = () => {
        this.setState({deleteModalOpen: !this.state.deleteModalOpen});
    }

    saveAccountDetails = () => {

        let accountObject = {
            "name": this.state.accountName,
            "account_type": this.state.accountType,
            "organization": this.state.organization.id,
            "current_balance": parseFloat(this.state.currentBalance) || 0.00,
            "credit_limit": parseFloat(this.state.creditLimit) || 0.00,
            "interest_rate": (parseFloat(this.state.interestRate) || 0),
            "owner": this.props.currentUser.id
        }

        if (this.state.id) {
            this.props.updateAccount(this.state.id, accountObject);

        } else {
            this.props.createAccount(accountObject);
        }

        this.props.history.goBack();
    }

    deleteAccount = () => {
        this.props.deleteAccount(this.state.id);
        this.props.history.push("/financial/accounts");
    }

    currencyFormat(props) {
        const { inputRef, onChange, ...other } = props;
      
        return (
          <NumberFormat
            {...other}
            getInputRef={inputRef}
            style={{"textAlign": "right"}}
            onValueChange={(values) => {
              onChange({
                target: {
                  name: props.name,
                  value: values.value,
                },
              });
            }}
            onClick={(e) => {
                e.target.select();
            }}
            onBlur={props.onBlur}
            decimalScale={2}
            fixedDecimalScale={true}
            thousandSeparator
            isNumericString
            prefix="$"
          />
        );
      }

      percentageFormat(props) {
        const { inputRef, onChange, ...other } = props;
      
        return (
          <NumberFormat
            {...other}
            getInputRef={inputRef}
            style={{"textAlign": "right"}}
            onValueChange={(values) => {
              onChange({
                target: {
                  name: props.name,
                  value: values.value,
                },
              });
            }}
            onClick={(e) => {
                e.target.select();
            }}
            onBlur={props.onBlur}
            decimalScale={2}
            fixedDecimalScale={true}
            thousandSeparator
            isNumericString
            suffix="%"
          />
        );
      }

    render() {
        const { classes } = this.props;

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
                    <Grid container spacing={3} justify="space-between">
                        <Grid item>
                            <Button color="primary" variant="outlined" size="small"
                                onClick={this.props.history.goBack}>Back</Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary" variant="contained" size="small" disabled={!this.state.isValid}
                                onClick={this.saveAccountDetails}>Save</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={4}>
                                <CardContent>
                                    <Container>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth={true}>
                                                    <InputLabel htmlFor="accountName">Account Name*</InputLabel>
                                                    <Input id="accountName" name="accountName" 
                                                        onChange={this.onChange} value={this.state.accountName ? this.state.accountName : ""} 
                                                        fullWidth={true} />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <AutoComplete id="accountType" name="accountType"
                                                    fullWidth={true} 
                                                    options={accountTypes}
                                                    getOptionLabel={(option) => option.label}
                                                    getOptionSelected={(option, value) => this.accountTypeSelected(option, value)}
                                                    value={accountTypes.filter(acctType => {return acctType.value == this.state.accountType})[0] || null}
                                                    onChange={(event, selection) => {if (selection) this.onChange({target: {name: "accountType", value: selection.value}})}}
                                                    renderInput={(params) => <TextField {...params} label="Account Type*" variant="standard" />}>
                                                </AutoComplete>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <AutoComplete id="organization" name="organization"
                                                    fullWidth={true} 
                                                    options={this.props.financialInstitutions ? this.props.financialInstitutions : []}
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionSelected={(option, value) => this.institutionSelected(option, value)}
                                                    value={this.state.organization || null}
                                                    onChange={(event, value) => this.onChange({target: {name: "organization", value: value}})}
                                                    renderInput={(params) => <TextField {...params} label="Financial Institution*" variant="standard" />}>
                                                </AutoComplete>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField id="currentBalance" name="currentBalance"
                                                    label="Balance"
                                                    className={classes.numberInput}
                                                    onChange={this.onChange.bind(this)} 
                                                    value={this.state.currentBalance}
                                                    fullWidth={true} InputProps={{inputComponent: this.currencyFormat,}}/> 
                                            </Grid>
                                            { this.state.accountType === "CR" ? this.creditFields(classes) : null }
                                        </Grid>
                                    </Container>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
                { this.state.id && 
                    <>
                        { this.deleteButton(classes) }
                        { this.deleteModal(classes) }
                    </>
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

export default connect(mapStateToProps, { createAccount, updateAccount, deleteAccount, setTitle })(withStyles(styles, { withTheme: true })(AccountInfo));