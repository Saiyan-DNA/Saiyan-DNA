import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
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
        currentBalance: "",
        creditLimit: "",
        interestRate: "",
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
        if(this.props.account && this.props.financialInstitutions) {
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
        if (e.target.name == "financialInstitution") {
            this.props.financialInstitutions.forEach(inst => {
                if (inst.id == e.target.value) {
                    this.setState({organization: inst});
                }
            })
        } else {
            this.setState({[e.target.name]: e.target.value});
        }
    }

    creditFields = (classes) => {
        return (
            <>
            <Grid item xs={6}>
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="creditLimit">Credit Limit</InputLabel>
                    <Input id="creditLimit" name="creditLimit" classes={{input: classes.numberInput}}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        onChange={this.onChange} value={this.state.creditLimit}
                        fullWidth={true} type="number" />
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth={true}>
                    <InputLabel htmlFor="interestRate">Interest Rate</InputLabel>
                    <Input id="interestRate" name="interestRate" classes={{input: classes.numberInput}}
                        endAdornment={<InputAdornment position="end">%</InputAdornment>}
                        onChange={this.onChange} value={this.state.interestRate}
                        fullWidth={true} type="number" />
                </FormControl>
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
            "interest_rate": (parseFloat(this.state.interestRate) || 0)/100,
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

    amountFormat(props) {
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

    render() {
        const { classes } = this.props;

        const accountTypes = [
            "Checking",
            "Savings",
            "Credit Card",
            "Investment",
            "Loan"
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
                                                <FormControl fullWidth={true}>
                                                    <InputLabel htmlFor="accountType">Account Type</InputLabel>
                                                    <Select id="accountType" name="accountType"
                                                        onChange={this.onChange} value={this.state.accountType ? this.state.accountType : "None"}
                                                        fullWidth={true} defaultValue={this.state.accountType}>
                                                            <MenuItem value="None"><em>None</em></MenuItem>
                                                            <MenuItem value={"CK"}>Checking</MenuItem>
                                                            <MenuItem value={"SV"}>Savings</MenuItem>
                                                            <MenuItem value={"CR"}>Credit Card</MenuItem>
                                                            <MenuItem value={"IN"}>Investment</MenuItem>
                                                            <MenuItem value={"LN"}>Loan</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth={true}>
                                                    <InputLabel htmlFor="financialInstitution">Financial Institution</InputLabel>
                                                    <Select id="financialInstitution" name="financialInstitution"
                                                        onChange={this.onChange} value={this.state.organization ? this.state.organization.id : "None"}
                                                        fullWidth={true} defaultValue={0}>
                                                            <MenuItem value="None"><em>None</em></MenuItem>
                                                            { this.props.financialInstitutions.map(institution => (
                                                                <MenuItem key={institution.id} value={institution.id}>{institution.name}</MenuItem>    
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                {/* <FormControl fullWidth={true}>      
                                                    <InputLabel htmlFor="currentBalance">Balance</InputLabel>                                            
                                                    <Input id="currentBalance" name="currentBalance" classes={{input: classes.numberInput}}
                                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                        onChange={this.onChange} value={this.state.currentBalance}
                                                        fullWidth={true} type="number" />
                                                </FormControl> */}
                                                <TextField id="currentBalance" name="currentBalance"
                                                    label="Balance"
                                                    className={classes.numberInput}
                                                    onChange={this.onChange.bind(this)} 
                                                    value={this.state.currentBalance}
                                                    fullWidth={true} InputProps={{inputComponent: this.amountFormat,}}/> 
                                            </Grid>
                                            { this.state.accountType === "Credit Card" ? this.creditFields(classes) : null }
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