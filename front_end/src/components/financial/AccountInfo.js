import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AutoComplete from '@material-ui/lab/Autocomplete'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import NumberFormat from 'react-number-format';

import { createAccount, updateAccount, deleteAccount, getInstitutions } from '../../actions/accounts';
import { setTitle } from '../../actions/navigation';


const styles = theme => ({
    numberInput: {
        textAlign: "right"
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

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
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
                        label="Credit Limit"
                        className={classes.numberInput}
                        onChange={this.onChange.bind(this)} 
                        value={this.state.creditLimit}
                        fullWidth={true} InputProps={{inputComponent: this.currencyFormat,}} /> 
                </Grid>
                <Grid item xs={6}>
                    <TextField id="interestRate" name="interestRate"
                        label="Interest Rate"
                        onChange={this.onChange.bind(this)}
                        value={this.state.interestRate}
                        fullWidth={true} InputProps={{inputComponent: this.percentageFormat,}} />
                </Grid>
            </>
        );
    }

    deleteButton = () => {
        return (
            <Button variant="contained" size="small" color="primary" 
                style={{backgroundColor: "#c62828", marginTop: "1em"}}
                onClick={this.deleteAccount}>Delete Account</Button>
        );
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
                            <Button color="primary" variant="contained" size="small"
                                onClick={this.saveAccountDetails}>Save</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={4}>
                                <CardContent>
                                    <Container>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth={true}>
                                                    <InputLabel htmlFor="accountName">Account Name</InputLabel>
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
                                                    renderInput={(params) => <TextField {...params} label="Account Type" variant="standard" />}>
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
                                                    renderInput={(params) => <TextField {...params} label="Financial Institution" variant="standard" />}>
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
                { this.state.id ? this.deleteButton() : null }
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