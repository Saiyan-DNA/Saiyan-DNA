import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material-Layout" */));

const Chip = loadable(() => import('@material-ui/core/Chip' /* webpackChunkName: "Material" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material-Layout" */));
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material-Layout" */));

const NumberFormat = loadable(() => import('react-number-format' /* webpackChunkName: "General" */));

const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});

import { editTransaction } from '../../actions/transactions';

const styles = theme => ({
    transactionSummary: {
        margin: 0,
        padding: "2px",
        paddingTop: "8px",
        paddingBottom: "8px",
        borderBottom: "0.5px solid #DCDCDC",
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
    }
});

class TransactionList extends React.Component {

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

    render() {
        const { account, transactions, transactionsLoading, transactionsLoaded, editTransaction, isMobile, classes } = this.props

        if (transactionsLoading) {
            return <LoadingMessage message="Loading Transactions" />
        }

        if (!transactionsLoading && transactionsLoaded && transactions && transactions.length) {
            var acctType = account.account_type;

            return (
                <List>
                    { transactions.map(trns => (
                        <div key={trns.id}>
                            <ListItem button className={classes.transactionSummary} 
                                onClick={() => this.editTransaction(trns)}>
                                <Grid container spacing={1} justifyContent="space-between">
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
                                        <Grid item item xs={4} sm={2} className={classes.numberFormat}>
                                            <Typography variant="caption" className={classes.listCaption}>{trns.transaction_date}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>                                
                            </ListItem>
                        </div>                                
                    ))}
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