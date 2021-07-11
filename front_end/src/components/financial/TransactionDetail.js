import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Navigation" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Layout" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Layout" */));
const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Material" */));
const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material" */));
const TextField = loadable(() => import('@material-ui/core/TextField' /* webpackChunkName: "Material" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

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
                this.setState({transaction: {
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
                }});
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
                let { transferFromAccount, transferToAccount } = updatedTransaction;

                if (!transferFromAccount && !transferToAccount) {
                    updatedTransaction.transferFromAccount = account;
                } else {
                    if (transferFromAccount && transferFromAccount.id != account.id) updatedTransaction.transferToAccount = account; 
                    if (transferToAccount && transferToAccount.id != account.id) updatedTransaction.transferFromAccount = account;
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

        if (transaction.transactionId) {
            updateTransaction(trns)
        } else {
            createTransaction(trns);
        }

        this.onClose();
    }

    deleteTransaction = () => {
        const { deleteTransaction } = this.props;
        const { transaction } = this.state;

        if (transaction.transactionId) deleteTransaction(transaction.transactionId);
        this.onClose();
    }

    handleDateChange = (newDate) => {
        this.onChange({target: {name: "transactionDate", value: newDate}});
    }

    generateDetail() {
        const { classes, isMobile, account } = this.props;
        const { transferDetailsVisible, transaction } = this.state;
        
        return (
            <form onSubmit={this.saveTransaction} autoComplete="off">
                <Grid container spacing={2} justify="space-between" className={isMobile ? classes.detailContainer : null}>
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
                </Grid>
            </form>
        );
    }

    render() {
        const { classes, isMobile } = this.props;
        const { transaction } = this.state;
        
        // If user is on a mobile phone, transaction detail displays as a separate page view.
        if (isMobile) {
            return (
                <Container>
                    <Grid container spacing={3} justify="space-between">
                        <Grid item>
                            <Button color="primary" variant="outlined" size="small" onClick={this.onClose}>Back</Button>
                        </Grid>
                        <Grid item>
                            <Button color="primary" variant="contained" size="small" disabled={!transaction.isValid} 
                                onClick={this.saveTransaction}>Save</Button>
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
                </Container>                        
            );
        }

        // If user is not on a mobile phone device, then the transaction detail is contained within a modal on the Account Overview page view.
        return (
            <Grid container spacing={3}>
                <Grid item container xs={12} justify="space-between">
                    {this.generateDetail()}
                </Grid>
                <Grid item xs={12}>
                    <Divider light={true} />
                </Grid>
                <Grid container item xs={12} justify="space-between">
                    <Grid item xs={4}>
                        {transaction.transactionId ? 
                            <DestructiveButton onClick={this.deleteTransaction}>Delete</DestructiveButton> :
                            <Typography>&nbsp;</Typography>
                        }
                    </Grid>                             
                    <Grid container item xs={8} justify="flex-end">
                        <Grid item>
                            <Button color="primary" variant="outlined" size="small" onClick={this.onClose}>Cancel</Button>
                        </Grid>
                        <Grid item>&nbsp;</Grid>
                        <Grid item>
                            <Button color="primary" variant="contained" size="small" disabled={!transaction.isValid} 
                                onClick={this.saveTransaction}>Save</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
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