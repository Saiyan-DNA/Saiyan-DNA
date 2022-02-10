import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import { Button, Chip, Divider, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material';

const ArrowUp = loadable(() => import('@mui/icons-material/KeyboardArrowUp' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});
const ArrowDown = loadable(() => import('@mui/icons-material/KeyboardArrowDown' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});

import NumberFormat from 'react-number-format';

import LoadingMessage from '../common/LoadingMessage';

import { editTransaction } from '../../actions/transactions';

const styles = theme => ({
    transactionSummary: {
        margin: "0em",
        padding: "0.5em 0em 0em 0em",
        ['@media print']: {
            paddingTop: "4px",
            paddingBottom: "4px"
        }
    },
    emptyMessage: {
        textAlign: "center",
        fontStyle: "italic",
        marginTop: "12px",
        marginBottom: "12px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    numberFormat: {
        textAlign: "right"
    },
    listCaption: {
        verticalAlign: "text-top", 
        fontStyle: "italic",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    showMore: {
        fontStyle: "italic",
        fontSize: "0.6em"
    }
});

class TransactionList extends React.Component {
    state = {
        transactionsShown: 10
    }

    static propTypes = {
        account: PropTypes.object.isRequired,
        editTransaction: PropTypes.func.isRequired,
        transactionsLoading: PropTypes.bool.isRequired,
        transactionsLoaded: PropTypes.bool.isRequired,
        transactions: PropTypes.array
    }

    editTransaction = (trns) => {
        const { isMobile, editTransaction, history } = this.props;
        
        editTransaction(trns);

        if (isMobile) {
            history.push("/financial/transaction");
        }

    }

    dynamicSummary = (trns) => {
        const { account } = this.props;

        if (trns.transaction_type == "TRN") {
            var transferDetail = trns.transfer_detail_debit || trns.transfer_detail_credit

            if (transferDetail.transfer_debit_transaction.account.id == account.id) {
                return transferDetail.transfer_credit_transaction.account.name
            }

            if (transferDetail.transfer_credit_transaction.account.id == account.id) {
                return transferDetail.transfer_debit_transaction.account.name
            }
        }

        return trns.organization ? trns.organization.name : trns.summary
    }

    dynamicDescription = (trns) => {
        if (trns.transaction_type == "TRN") {
            return "Transfer"
        }

        return trns.organization ? trns.summary : trns.description
    }

    showMore = () => {
        this.setState({transactionsShown: this.state.transactionsShown + 10});
    }

    showLess = () => {
        let newCount = this.state.transactionsShown - 10;
        this.setState({transactionsShown: newCount < 10 ? 10 : newCount});
    }

    render() {
        const { account, transactions, transactionsLoading, transactionsLoaded, editTransaction, isMobile, classes } = this.props
        const { transactionsShown } = this.state;

        if (transactionsLoading) {
            return <LoadingMessage message="Loading Transactions" />
        }

        if (!transactionsLoading && transactionsLoaded && transactions && transactions.length) {
            var acctType = account.account_type;

            var showMore = transactionsShown < transactions.length ? true : false;
            var showLess = transactionsShown > 10 ? true : false;

            return (
                <List>
                    { transactions.slice(0, transactionsShown).map(trns => (
                        <div key={trns.id}>
                            <ListItemButton divider onClick={() => this.editTransaction(trns)} style={{padding: "0px"}}>
                                <Grid container spacing={1} justifyContent="space-between" className={classes.transactionSummary} >
                                    <Grid container item spacing={0} xs={12} justifyContent="space-between">
                                        <Grid item xs={8} sm={6}>
                                            <Typography noWrap variant="body1">
                                                {this.dynamicSummary(trns)}
                                            </Typography>
                                        </Grid>
                                        {isMobile ? null :     
                                            <Grid container item sm={4} direction="column" justifyContent="flex-start">
                                                <Grid item sm={4}>
                                                {/* Transaction Category */}
                                                    {trns.financial_category ? <Chip size="small" color="secondary" label={trns.financial_category.name} /> : <span>&nbsp;</span>}
                                                </Grid>
                                            </Grid>
                                        }
                                        <Grid item xs={4} sm={2} className={classes.numberFormat}>
                                            {/* Transaction Amount */}
                                            <Typography variant="body1">
                                                <NumberFormat value={trns.amount} displayType={'text'}
                                                    thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}
                                                    prefix={
                                                        (acctType == 'CR' || acctType == 'LN') && trns.transaction_type == 'CRD' ? '-$' : 
                                                        (acctType == 'CK' || acctType == 'SV') && trns.transaction_type == 'DBT' ? '-$' : 
                                                        (acctType == 'CR' || acctType == 'LN') && trns.transaction_type == 'TRN' && trns.transfer_detail_credit ? '-$' :
                                                        (acctType == 'CK' || acctType == 'SV') && trns.transaction_type == 'TRN' && trns.transfer_detail_debit ? '-$' : '$'
                                                        }  />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8} sm={6}>
                                            <div className={classes.listCaption}>
                                                <Typography noWrap variant="caption" className={classes.listCaption}>
                                                    {this.dynamicDescription(trns)}
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={4} sm={2} className={classes.numberFormat}>
                                            <Typography variant="caption" className={classes.listCaption}>{trns.transaction_date}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>                                
                            </ListItemButton>
                        </div>                                
                    ))}
                    { (showLess || showMore) && (
                        <ListItem disableGutters>
                            <Grid container spacing={0} justifyContent="center">
                                { showLess && 
                                    <Grid item alignItems="center" onClick={this.showLess}>
                                        <Button color="inherit" fullWidth={true} className={classes.showMore} size="small"
                                            startIcon={<ArrowUp />} endIcon={<ArrowUp />}>Show Less</Button>
                                    </Grid>
                                }
                                { (showLess && showMore) && <Grid item xs={"auto"}><Divider orientation="vertical" light={true} /></Grid> }
                                { showMore &&
                                    <Grid item alignItems="center" onClick={this.showMore}>
                                        <Button color="inherit" fullWidth={true} className={classes.showMore} size="small"
                                            startIcon={<ArrowDown />} endIcon={<ArrowDown />}>Show More</Button>
                                    </Grid>
                                }
                            </Grid>
                        </ListItem>
                    )}
                </List>
            );
            
        }
        return (
            <Typography variant="body1" className={classes.emptyMessage}>No transactions available</Typography>
        );
    }
}

const mapStateToProps = state => ({
    account: state.accounts.currentAccount,
    transactionsLoading: state.transactions.transactionsLoading,
    transactionsLoaded: state.transactions.transactionsLoaded,
    transactions: state.transactions.transactions,
    isMobile: state.auth.isMobile
});

const mapDispatchToProps = {
    editTransaction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (TransactionList)));