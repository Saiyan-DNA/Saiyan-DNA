import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Material" */));
const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material" */));
const TextField = loadable(() => import('@material-ui/core/TextField' /* webpackChunkName: "Material" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

const DestructiveButton = loadable(() => import('../common/DestructiveButton' /* webpackChunkName: "General" */));
const BasicModal = loadable(() => import('../common/BasicModal' /* webpackChunkName: "General" */));
const AccountSelect = loadable(() => import ('./controls/AccountSelect' /* webpackChunkName: "Financial" */));
const FinancialCategorySelect = loadable(() => import('./controls/FinancialCategorySelect' /* webpackChunkName: "Financial" */));
const TransactionTypeSelect = loadable(() => import('./controls/TransactionTypeSelect' /* webpackChunkName: "Financial" */));

import { CurrencyFormat } from "../common/NumberFormats";


const styles = theme => ({
    numberFormat: {
        textAlign: "right"
    },
});

class TransactionModal extends React.Component {
    state = {}

    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        currentUser: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.resetState();
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
            this.resetState();
        }

    }

    resetState = () => {
        this.setState({
            transferDetailsVisible: false,
            transaction: {
                transactionId: null,
                transactionType: "",
                transactionSummary: "",
                transactionDescription: "",
                transactionCategory: null,
                transactionAmount: "",
                transferFromAccount: null,
                transferToAccount: null,
                isValid: false,
                isEdited: false,
            }
        });
    }

    validateTransaction = (e, transaction) => {
        var transDetails = (transaction ? transaction : this.state.transaction);

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
        const { accounts } = this.props;

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
        if (["transactionType", "transactionCategory", "transferFromAccount", "transferToAccount"].includes(e.target.name)) {
            this.validateTransaction(e, updatedTransaction);
        }
    }

    saveTransaction = () => {
        const { onClose } = this.props;
        const { transaction } = this.state;

        console.log(transaction);
        onClose();
    }

    deleteTransaction = () => {
        const { onClose } = this.props;
        const { transaction } = this.state;

        console.log("Delete Transaction!");
        onClose();
    }

    render() {
        const { isOpen, onClose } = this.props;
        const { transaction, transferDetailsVisible } = this.state;

        if (transaction) {
            return (
                <BasicModal open={isOpen} onClose={onClose} title={transaction.transactionId ? "Edit Transaction" : "Add Transaction"}>
                    <Grid container spacing={2} justify="space-between">
                        <Grid item xs={6} sm={6}>
                            <TransactionTypeSelect onChange={this.onChange} onBlur={this.validateTransaction}
                                value={transaction.transactionType ? transaction.transactionType : ""}
                                defaultValue={transaction.transactionType} />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <TextField id="transactionAmount" name="transactionAmount"
                                label="Amount" className="numberFormat"
                                onChange={this.onChange.bind(this)} onBlur={this.validateTransaction.bind(this)}
                                value={transaction.transactionAmount} fullWidth={true} InputProps={{inputComponent: CurrencyFormat,}}/>                                
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth={true}>
                                <InputLabel htmlFor="transactionDescription">Summary</InputLabel>
                                <Input id="transactionSummary" name="transactionSummary" 
                                    onChange={this.onChange.bind(this)} onBlur={this.validateTransaction.bind(this)}
                                    value={transaction.transactionSummary} fullWidth={true} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth={true}>
                                <InputLabel htmlFor="transactionDescription">Description</InputLabel>
                                <Input id="transactionDescription" name="transactionDescription" 
                                    onChange={this.onChange.bind(this)} onBlur={this.validateTransaction.bind(this)}
                                    value={transaction.transactionDescription} fullWidth={true} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FinancialCategorySelect id="transactionCategory" name="transactionCategory"
                                selection={transaction.transactionCategory} onChange={this.onChange} />
                        </Grid>
                        { transferDetailsVisible &&
                            <>
                                <Grid item xs={12} sm={12}>
                                    <AccountSelect id="transferFromAccount" name="transferFromAccount"
                                        label="Transfer From" selection={transaction.transferFromAccount} 
                                        onChange={this.onChange} onBlur={this.validateTransaction}                                        
                                        disabledAccount={transaction.transferToAccount} />       
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <AccountSelect id="transferToAccount" name="transferToAccount"
                                        label="Transfer To" selection={transaction.transferToAccount}
                                        onChange={this.onChange} onBlur={this.validateTransaction}                                        
                                        disabledAccount={transaction.transferFromAccount}  />
                                </Grid>
                            </>
                        }
                        <Grid item xs={12} sm={12}>
                            <Divider />
                        </Grid>
                        <Grid container item xs={12} justify="space-between">
                            <Grid item xs={4}>
                                {transaction.transactionId ? 
                                    <DestructiveButton onClick={this.deleteTransaction}>Delete</DestructiveButton> :
                                    <Typography>&nbsp;</Typography>
                                }
                            </Grid>                                
                            <Grid container xs={8} item justify="flex-end">
                                <Grid item>
                                    <Button color="primary" variant="outlined" size="small" onClick={onClose}>Cancel</Button>
                                </Grid>
                                <Grid item>&nbsp;</Grid>
                                <Grid item>
                                    <Button color="primary" variant="contained" size="small" disabled={!transaction.isValid} 
                                        onClick={this.saveTransaction}>Save</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </BasicModal>
            )
        } else {
            return (<div>&nbsp;</div>);
        }
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user
});

export default connect(mapStateToProps, {  })(withStyles(styles, {withTheme: true})
    (TransactionModal));