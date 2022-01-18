import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material-Navigation" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material-Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Material-Layout" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material-Layout" */));
const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Material" */));
const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material-Input" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material-Layout" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material-Input" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material-Input" */));
const TextField = loadable(() => import('@material-ui/core/TextField' /* webpackChunkName: "Material-Input" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material-Layout" */));

const DestructiveButton = loadable(() => import('../common/DestructiveButton' /* webpackChunkName: "General" */));
const AccountSelect = loadable(() => import ('./controls/AccountSelect' /* webpackChunkName: "Financial" */));
const FinancialCategorySelect = loadable(() => import('./controls/FinancialCategorySelect' /* webpackChunkName: "Financial" */));
const TransactionTypeSelect = loadable(() => import('./controls/TransactionTypeSelect' /* webpackChunkName: "Financial" */));

import { CurrencyFormat } from '../common/NumberFormats'
import { toggleTransactionModal, clearTransaction, createTransaction, updateTransaction, deleteTransaction } from '../../actions/transactions';
import { setTitle } from '../../actions/navigation';

const styles = theme => ({
    detailContainer: {
        padding: "0px"
    },
    numberInput: {
        textAlign: "right"
    },
    deleteButton: {
        marginTop: "0.5em"
    }
});

class TransactionDetail extends React.Component {
    state = {
        transferDetailsVisible: false,
        transaction: {
            transactionId: null,
            transactionDate: new Date(),
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
    }

    static propTypes = {
        accounts: PropTypes.array.isRequired,
        transaction: PropTypes.object,
        financialInstitutions: PropTypes.array.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        currentUser: PropTypes.object.isRequired,
        isMobile: PropTypes.bool.isRequired,
        setTitle: PropTypes.func.isRequired,
        toggleTransactionModal: PropTypes.func.isRequired,
        createTransaction: PropTypes.func.isRequired,
        updateTransaction: PropTypes.func.isRequired,
        deleteTransaction: PropTypes.func.isRequired
    }

    componentDidMount() {
        var { transaction, isMobile, setTitle } = this.props;
        var localTransaction = this.state.transaction;

        if (isMobile) {
            setTitle(transaction ? "Edit Transaction" : "Add Transaction");
        }

        
        // Apply transaction details to component state for potential edit by the end-user.
        if (transaction && transaction.id != localTransaction.transactionId) {
            if (transaction.id) {
                var transactionDetail = {
                    transactionId: transaction.id,
                    transactionDate: new Date(transaction.transaction_date),
                    transactionType: transaction.transaction_type,
                    transactionSummary: transaction.summary, 
                    transactionDescription: transaction.description,
                    transactionCategory: transaction.financial_category,
                    transactionAmount: transaction.amount,
                    transferFromAccount: "",
                    transferToAccount: "",
                    isEdited: false,
                    isValid: false
                }

                if (transaction.transaction_type == "TRN") {
                    var transferDetail = transaction.transfer_detail_debit || transaction.transfer_detail_credit;

                    transactionDetail.transferFromAccount = transferDetail.transfer_debit_transaction.account;
                    transactionDetail.transferToAccount = transferDetail.transfer_credit_transaction.account;
                }

                this.setState({transaction: transactionDetail, transferDetailsVisible: (transaction.transaction_type == "TRN")});
            }

            return;
        }
        
        this.resetState();
        return;
    }

    resetState = () => {
        this.setState({
            transferDetailsVisible: false,
            transaction: {
                transactionId: null,
                transactionDate: new Date(),
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

        transDetails.isValid = true;

        // Transaction is invalid if it does not have an amount
        if (transDetails.transctionAmount === "" || parseFloat(transDetails.transactionAmount) === 0.0) {
            transDetails.isValid = false;
        }

        // Transaction is invalid if it is of type transfer and the To/From accounts are not specified.
        if (transDetails.transactionType == "TRN" && (transDetails.transferFromAccount === "" || transDetails.transferToAccount === "")) {
            transDetails.isValid = false;
        }

        // Transaction is invalid if it does not have a summary
        if (transDetails.transactionSummary === "") {
            transDetails.isValid = false;
        }

        this.setState({transaction: transDetails});
    }

    onChange = (e) => {
        const { accounts, account } = this.props;

        if (e.target) {
            var updatedTransaction = {...this.state.transaction};

            updatedTransaction[e.target.name] = e.target.value;
            updatedTransaction["isEdited"] = true;

            // All transaction amounts should be positive. (Mathmatical operations applied based on transaction type - Debit, Credit, Transfer To/From)
            var trnsAmount = updatedTransaction.transactionAmount
            if (trnsAmount < 0) {
                updatedTransaction.transactionAmount = Math.abs(trnsAmount);
            }
            
            
            // Determine whether Transfer Details are applicable and if so, ensure one of the two accounts involved is the currently selected account.
            var showTransferDetails = false;

            if (updatedTransaction.transactionType == "TRN") {
                showTransferDetails = true;                

                if (!updatedTransaction.transferFromAccount && !updatedTransaction.transferToAccount) {
                    updatedTransaction.transferFromAccount = account;
                } else {                    
                    // Allow swapping to/from accounts
                    const { transferToAccount, transferFromAccount } = this.state.transaction

                    if (transferToAccount && updatedTransaction.transferFromAccount && updatedTransaction.transferFromAccount.id == transferToAccount.id) {
                        updatedTransaction.transferToAccount = transferFromAccount;
                    }
                    if (transferFromAccount && updatedTransaction.transferToAccount && updatedTransaction.transferToAccount.id == transferFromAccount.id) {
                        updatedTransaction.transferFromAccount = transferToAccount;
                    }
                    
                    // Ensure either the to/from account is the currently viewed account
                    if (e.target.name == 'transferFromAccount' && updatedTransaction.transferFromAccount && updatedTransaction.transferFromAccount.id != account.id) {
                        updatedTransaction.transferToAccount = account;
                    }
                    if (e.target.name == 'transferToAccount' && updatedTransaction.transferToAccount && updatedTransaction.transferToAccount.id != account.id) {
                        updatedTransaction.transferFromAccount = account;
                    }
                }                
            }

            // Run Validate without waiting for 'onBlur' event for Select elements
            if (["transactionDate", "transactionType", "transactionCategory", "transferFromAccount", "transferToAccount"].includes(e.target.name)) {
                this.validateTransaction(e, updatedTransaction);
            }

            this.setState({transferDetailsVisible: showTransferDetails, transaction: updatedTransaction});
        }
    }

    onClose = () => {
        const { isMobile, history, clearTransaction, toggleTransactionModal } = this.props;

        if (isMobile) history.push("/financial/AccountOverview");
        else {
            clearTransaction();
            toggleTransactionModal();
        }
    }

    saveTransaction = () => {
        const { createTransaction, updateTransaction, account, currentUser } = this.props;
        const { transaction } = this.state;

        var trns = {
            id: transaction.transactionId,
            summary: transaction.transactionSummary,
            description: transaction.transactionDescription,
            transaction_date: transaction.transactionDate.toJSON(),
            transaction_type: transaction.transactionType,
            amount: parseFloat(transaction.transactionAmount),
            account: account.id,
            financial_category: transaction.transactionCategory ? transaction.transactionCategory.id : null,
            owner: currentUser.id,
            organization: null
        }

        var transferDetail = null;

        if (transaction.transactionType == "TRN") {
            transferDetail = {
                transfer_from: transaction.transferFromAccount.id,
                transfer_to: transaction.transferToAccount.id
            }
        }

        if (transaction.transactionId) {
            updateTransaction(trns, transferDetail)
        } else {
            createTransaction(trns, transferDetail);
        }

        this.onClose();
    }

    deleteTransaction = () => {
        const { deleteTransaction } = this.props;
        const { transaction } = this.state;

        if (transaction.transactionId) deleteTransaction(transaction);
        this.onClose();
    }

    handleDateChange = (newDate) => {
        this.onChange({target: {name: "transactionDate", value: newDate}});
    }

    generateDetail() {
        const { classes, isMobile, account } = this.props;
        const { transferDetailsVisible, transaction } = this.state;
        
        return (
            <Grid container spacing={2} justifyContent="space-between" className={isMobile ? classes.detailContainer : null}>
                <Grid item xs={6} sm={6}>
                    <FormControl fullWidth={true} disabled={true}>
                        <InputLabel htmlFor="accountName">Account</InputLabel>
                        <Input id="accountName" name="accountName" value={account.name} fullWidth={true} />
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker disableToolbar variant={isMobile ? "dialog" : "inline"} style={{marginTop: "0px"}}
                            format="MM/dd/yyyy" margin="normal" id="transactionDate" name="transactionDate" autoOk={ isMobile ? false : true }
                            label="Transaction Date" value={transaction.transactionDate} onChange={this.handleDateChange}
                            KeyboardButtonProps={{'aria-label': 'change date',}} />
                    </MuiPickersUtilsProvider>
                </Grid> 
                <Grid item xs={6} sm={6}>
                    <TransactionTypeSelect onChange={this.onChange} onBlur={this.validateTransaction}
                        value={transaction.transactionType ? transaction.transactionType : ""}
                        defaultValue={transaction.transactionType} />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <TextField id="transactionAmount" name="transactionAmount"
                        label="Amount" className="numberFormat"
                        onChange={this.onChange} onBlur={this.validateTransaction}
                        value={transaction.transactionAmount} fullWidth={true} InputProps={{inputComponent: CurrencyFormat,}}/>                                
                </Grid>
                <Grid item xs={12} sm={12}>
                    <FormControl fullWidth={true}>
                        <InputLabel htmlFor="transactionDescription">Summary</InputLabel>
                        <Input id="transactionSummary" name="transactionSummary" 
                            onChange={this.onChange} onBlur={this.validateTransaction}
                            value={transaction.transactionSummary} fullWidth={true} />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <FormControl fullWidth={true}>
                        <InputLabel htmlFor="transactionDescription">Description</InputLabel>
                        <Input id="transactionDescription" name="transactionDescription" 
                            onChange={this.onChange} onBlur={this.validateTransaction}
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
                                onChange={this.onChange} onBlur={this.validateTransaction} />       
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <AccountSelect id="transferToAccount" name="transferToAccount"
                                label="Transfer To" selection={transaction.transferToAccount}
                                onChange={this.onChange} onBlur={this.validateTransaction} />
                        </Grid>
                    </>
                }
            </Grid>
        );
    }

    render() {
        const { classes, isMobile } = this.props;
        const { transaction } = this.state;
        
        // If user is on a mobile phone, transaction detail displays as a separate page view.
        if (isMobile) {
            return (
                <Container>
                    <form onSubmit={this.saveTransaction} autoComplete="off">
                        <Grid container spacing={3} justifyContent="space-between">
                            <Grid item>
                                <Button color="primary" variant="outlined" size="small" onClick={this.onClose}>Back</Button>
                            </Grid>
                            <Grid item>
                                <Button type="submit" color="primary" variant="contained" size="small"
                                    disabled={!transaction.isValid}>Save</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Card elevation={4}>
                                    <CardContent>
                                        {this.generateDetail()}
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                {transaction.transactionId ? 
                                    <DestructiveButton onClick={this.deleteTransaction}>Delete</DestructiveButton> :
                                    <Typography>&nbsp;</Typography>
                                }
                            </Grid>
                        </Grid>
                    </form>
                </Container>                        
            );
        }

        // If user is not on a mobile phone device, then the transaction detail is contained within a modal on the Account Overview page view.
        return (
            <form autoComplete="off">
                <Grid container spacing={3}>
                    <Grid item container xs={12} justifyContent="space-between">
                        {this.generateDetail()}
                    </Grid>
                    <Grid item xs={12}>
                        <Divider light={true} />
                    </Grid>
                    <Grid container item xs={12} justifyContent="space-between">
                        <Grid item xs={4}>
                            {transaction.transactionId ? 
                                <DestructiveButton onClick={this.deleteTransaction}>Delete</DestructiveButton> :
                                <Typography>&nbsp;</Typography>
                            }
                        </Grid>                             
                        <Grid container item xs={8} justifyContent="flex-end">
                            <Grid item>
                                <Button color="primary" variant="outlined" size="small" onClick={this.onClose}>Cancel</Button>
                            </Grid>
                            <Grid item>&nbsp;</Grid>
                            <Grid item>
                                <Button onClick={this.saveTransaction} color="primary" variant="contained" size="small"
                                    disabled={!transaction.isValid}>Save</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    isMobile: state.auth.isMobile,
    account: state.accounts.currentAccount,
    accounts: state.accounts.accounts,
    transaction: state.transactions.currentTransaction,
    financialInstitutions: state.accounts.financialInstitutions
});

const mapDispatchToProps = {
    toggleTransactionModal,
    clearTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TransactionDetail));