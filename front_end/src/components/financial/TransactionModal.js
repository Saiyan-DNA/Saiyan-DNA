import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AutoComplete from '@material-ui/lab/Autocomplete'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';

import DestructiveButton from '../common/DestructiveButton';
import BasicModal from '../common/BasicModal';

import { getFinancialCategories } from '../../actions/financial_categories';


const styles = theme => ({
    numberFormat: {
        textAlign: "right"
    },
});

class TransactionModal extends React.Component {
    state = {
        transferDetailsVisible: false,
        transaction: {
            transactionId: null,
            transactionType: "",
            transactionSummary: "",
            transactionDescription: "",
            transactionCategory: null,
            transactionAmount: "",
            transferFromAccount: "",
            transferToAccount: "",
            isValid: false,
            isEdited: false,
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        currentUser: PropTypes.object.isRequired,
        accounts: PropTypes.array.isRequired,
        getFinancialCategories: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getFinancialCategories();
    }

    componentDidUpdate() {
        var trns = this.props.transaction;

        // Apply transaction details to component state for potential edit by the end-user.
        if (trns.id != this.state.transaction.transactionId) {
            if (trns.id) {
                this.setState({transaction: {
                    transactionId: trns.id,
                    transactionType: trns.transaction_type,
                    transactionSummary: trns.summary, 
                    transactionDescription: trns.description,
                    transactionCategory: trns.financial_category,
                    transactionAmount: trns.amount,
                    transferFromAccount: "",
                    transferToAccount: "",
                    isEdited: false,
                    isValid: false
                }});
            }
        } 

        // Clear Transaction details for modal (if any exist) on close.
        if (!this.props.open && (this.state.transaction.transactionId || this.state.transaction.isEdited)) {
            this.setState({transaction: {
                transactionId: null,
                transactionType: "",
                transactionSummary: "",
                transactionDescription: "",
                transactionCategory: null,
                transactionAmount: "",
                transferFromAccount: "",
                transferToAccount: "",
                isValid: false,
                isEdited: false,
            }});
        }

    }

    validateTransaction = (e, transaction) => {
        var transDetails = (transaction ? transaction: this.state.transaction);
        transDetails.isValid = false;

        if (transDetails.transactionType == "TRN" && transDetails.transactionAmount != "" && transDetails.transferFromAccount != "" && transDetails.transferToAccount != "") {
            transDetails.isValid = true;
        }

        if (["CRD", "DBT"].includes(transDetails.transactionType) && transDetails.transactionAmount != "") {
            transDetails.isValid = true;
        }

        this.setState({transaction: transDetails});
    }

    onChange = (e) => {
        var updatedTransaction = {...this.state.transaction};
        
        updatedTransaction[e.target.name] = e.target.value;
        updatedTransaction["isEdited"] = true;
        
        this.setState({"transaction": updatedTransaction});
        
        if (updatedTransaction.transactionType == "TRN") {
            this.setState({"transferDetailsVisible": true});
        } else {
            this.setState({"transferDetailsVisible": false});
        }

        // Run Validate without waiting for 'onBlur' event for Select elements
        if (["transactionType", "transferFromAccount", "transferToAccount"].includes(e.target.name)) {
            this.validateTransaction(e, updatedTransaction);
        }
    }

    categorySelected = (option, value) => {
        if (option.id == value.id) {
            return true
        }
        return false;
    }

    saveTransaction = () => {
        console.log(this.state.transaction);
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

        return (
            <BasicModal open={this.props.open} onClose={this.props.onClose} title={this.state.transaction.transactionId ? "Edit Transaction" : "Add Transaction"}>
                <Grid container spacing={2} justify="space-between">
                    <Grid item xs={6} sm={6}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionType">Type</InputLabel>
                            <Select id="transactionType" name="transactionType" fullWidth={true} 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={this.state.transaction.transactionType ? this.state.transaction.transactionType : ""}
                                defaultValue={this.state.transaction.transactionType}>
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value={"CRD"}>Credit</MenuItem>
                                    <MenuItem value={"DBT"}>Debit</MenuItem>
                                    <MenuItem value={"TRN"}>Transfer</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField id="transactionAmount" name="transactionAmount"
                            label="Amount"
                            className="numberFormat"
                            onChange={this.onChange.bind(this)} 
                            onBlur={this.validateTransaction.bind(this)}
                            value={this.state.transaction.transactionAmount}
                            fullWidth={true} InputProps={{inputComponent: this.amountFormat,}}/>                                
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionDescription">Summary</InputLabel>
                            <Input id="transactionSummary" name="transactionSummary" 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={this.state.transaction.transactionSummary} 
                                fullWidth={true} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionDescription">Description</InputLabel>
                            <Input id="transactionDescription" name="transactionDescription" 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={this.state.transaction.transactionDescription} 
                                fullWidth={true} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <AutoComplete id="transactionCategory" name="transactionCategory"
                            fullWidth={true} 
                            options={this.props.financialCategories ? this.props.financialCategories.sort((a, b) => a.path_name.localeCompare(b.path_name)) : []}
                            getOptionLabel={(option) => option.path_name}
                            getOptionSelected={(option, value) => this.categorySelected(option, value)}
                            value={this.state.transaction.transactionCategory}
                            onChange={(event, value) => this.onChange({target: {name: "transactionCategory", value: value}})}
                            renderInput={(params) => <TextField {...params} label="Category" variant="standard" />}>
                        </AutoComplete>

                    </Grid>
                    { this.state.transferDetailsVisible &&
                        <>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="transferFromAccount">Transfer From</InputLabel>
                                    <Select id="transferFromAccount" name="transferFromAccount"
                                        onChange={this.onChange.bind(this)} 
                                        onBlur={this.validateTransaction.bind(this)}
                                        value={this.state.transferFromAccount}
                                        fullWidth={true} defaultValue={this.state.transaction.transferFromAccount}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        { this.props.accounts.filter(acct => acct.account_type == "CK" || acct.account_type == "SV").sort((a, b) => a.name > b.name ? 1 : -1).map(acct => (
                                            <MenuItem key={acct.id} value={acct.id}
                                                disabled={acct.id == this.state.transaction.transferToAccount}>
                                                {acct.name}
                                            </MenuItem>    
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="transferToAccount">Transfer To</InputLabel>
                                    <Select id="transferToAccount" name="transferToAccount"
                                        onChange={this.onChange.bind(this)} 
                                        onBlur={this.validateTransaction.bind(this)}
                                        value={this.state.transaction.transferToAccount}
                                        fullWidth={true} defaultValue={this.state.transaction.transferToAccount}>
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            { this.props.accounts.sort((a, b) => a.name > b.name ? 1 : -1).map(acct => (
                                                <MenuItem key={acct.id} value={acct.id}
                                                    disabled={(acct.id == this.state.transaction.transferFromAccount)}>
                                                    {acct.name}
                                                </MenuItem>    
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    }
                    <Grid item xs={12} sm={12}>
                        <Divider />
                    </Grid>
                    <Grid container item xs={12} justify="space-between">
                        <Grid item xs={4}>
                            {this.state.transaction.transactionId ? 
                                <DestructiveButton onClick={() => console.log("Delete Transaction")}>Delete</DestructiveButton> :
                                <Typography>&nbsp;</Typography>
                            }
                        </Grid>                                
                        <Grid container xs={8} item justify="flex-end">
                            <Grid item>
                                <Button color="primary" variant="outlined" onClick={this.props.onClose}>Cancel</Button>
                            </Grid>
                            <Grid item>&nbsp;</Grid>
                            <Grid item>
                                <Button color="primary" variant="contained" disabled={!this.state.transaction.isValid} onClick={this.saveTransaction.bind(this)}>Save</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </BasicModal>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    accounts: state.accounts.accounts,
    financialCategories: state.accounts.financialCategories
});

export default connect(mapStateToProps, { getFinancialCategories })(withStyles(styles, {withTheme: true})
    (TransactionModal));