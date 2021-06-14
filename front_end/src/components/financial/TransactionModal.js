import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';

const AutoComplete = loadable(() => import('@material-ui/lab/Autocomplete' /* webpackChunkName: "Material" */));
const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Material" */));
const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material" */));
const MenuItem = loadable(() => import('@material-ui/core/MenuItem' /* webpackChunkName: "Material" */));
const Select = loadable(() => import('@material-ui/core/Select' /* webpackChunkName: "Material" */));
const TextField = loadable(() => import('@material-ui/core/TextField' /* webpackChunkName: "Material" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material" */));

const DestructiveButton = loadable(() => import('../common/DestructiveButton' /* webpackChunkName: "General" */));
const BasicModal = loadable(() => import('../common/BasicModal' /* webpackChunkName: "General" */));

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
        getFinancialCategories: PropTypes.func.isRequired,
        financialCategories: PropTypes.array
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
        if (!this.props.isOpen && (this.state.transaction.transactionId || this.state.transaction.isEdited)) {
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
        const { classes, isAuthenticated, currentUser, accounts, financialCategories, isOpen, onClose } = this.props;
        const { transaction, transferDetailsVisible } = this.state;

        return (
            <BasicModal open={isOpen} onClose={onClose} title={transaction.transactionId ? "Edit Transaction" : "Add Transaction"}>
                <Grid container spacing={2} justify="space-between">
                    <Grid item xs={6} sm={6}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionType">Type</InputLabel>
                            <Select id="transactionType" name="transactionType" fullWidth={true} 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={transaction.transactionType ? transaction.transactionType : ""}
                                defaultValue={transaction.transactionType}>
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
                            value={transaction.transactionAmount}
                            fullWidth={true} InputProps={{inputComponent: this.amountFormat,}}/>                                
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionDescription">Summary</InputLabel>
                            <Input id="transactionSummary" name="transactionSummary" 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={transaction.transactionSummary} 
                                fullWidth={true} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionDescription">Description</InputLabel>
                            <Input id="transactionDescription" name="transactionDescription" 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={transaction.transactionDescription} 
                                fullWidth={true} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <AutoComplete id="transactionCategory" name="transactionCategory"
                            fullWidth={true} 
                            options={financialCategories ? financialCategories.sort((a, b) => a.path_name.localeCompare(b.path_name)) : []}
                            getOptionLabel={(option) => option.path_name}
                            getOptionSelected={(option, value) => this.categorySelected(option, value)}
                            value={transaction.transactionCategory}
                            onChange={(event, value) => this.onChange({target: {name: "transactionCategory", value: value}})}
                            renderInput={(params) => <TextField {...params} label="Category" variant="standard" />}>
                        </AutoComplete>

                    </Grid>
                    { transferDetailsVisible &&
                        <>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="transferFromAccount">Transfer From</InputLabel>
                                    <Select id="transferFromAccount" name="transferFromAccount"
                                        onChange={this.onChange.bind(this)} 
                                        onBlur={this.validateTransaction.bind(this)}
                                        value={transaction.transferFromAccount}
                                        fullWidth={true} defaultValue={transaction.transferFromAccount}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        { accounts.filter(acct => acct.account_type == "CK" || acct.account_type == "SV").sort((a, b) => a.name > b.name ? 1 : -1).map(acct => (
                                            <MenuItem key={acct.id} value={acct.id}
                                                disabled={acct.id == transaction.transferToAccount}>
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
                                        value={transaction.transferToAccount}
                                        fullWidth={true} defaultValue={transaction.transferToAccount}>
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            { this.props.accounts.sort((a, b) => a.name > b.name ? 1 : -1).map(acct => (
                                                <MenuItem key={acct.id} value={acct.id}
                                                    disabled={(acct.id == transaction.transferFromAccount)}>
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
                            {transaction.transactionId ? 
                                <DestructiveButton onClick={() => console.log("Delete Transaction")}>Delete</DestructiveButton> :
                                <Typography>&nbsp;</Typography>
                            }
                        </Grid>                                
                        <Grid container xs={8} item justify="flex-end">
                            <Grid item>
                                <Button color="primary" variant="outlined" onClick={onClose}>Cancel</Button>
                            </Grid>
                            <Grid item>&nbsp;</Grid>
                            <Grid item>
                                <Button color="primary" variant="contained" disabled={!transaction.isValid} onClick={this.saveTransaction.bind(this)}>Save</Button>
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