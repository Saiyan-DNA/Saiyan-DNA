import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Button, Container, Divider, Grid, Link, Menu, MenuItem, Select, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const CurrencyFormat = loadable(() => import('../common/CurrencyFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const PercentageFormat = loadable(() => import('../common/PercentageFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const SummaryCard = loadable(() => import('../common/SummaryCard' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const InfoTile = loadable(() => import('../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const DateRangeSelector = loadable(() => import('../common/DateRangeSelector' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const TransactionList = loadable(() => import ('./TransactionList' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>})
const TransactionModal = loadable(() => import('./TransactionModal' /* webpackChunkName: "Financial" */));

import { setTitle } from '../../actions/navigation';
import { getAccount } from '../../actions/accounts';
import { clearTransaction, editTransaction } from '../../actions/transactions';
import { getFinancialCategories } from '../../actions/financial_categories';

const styles = theme => ({
    listCard: {
        backgroundColor: theme.palette.primary.main
    },
    listCardHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(1,1,1),
        ['@media print']: {
            backgroundColor: "inherit",
            color: "inherit",
            borderBottom: "0.5px solid #DCDCDC"
        }
    },
    listCardContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(0,1,0)
    },
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
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    },
    listCaption: {
        verticalAlign: "text-top", 
        fontStyle: "italic",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
});


class AccountOverview extends React.Component {
    state = {
        actionMenuOpen: false,
        menuAnchor: null,
        filterType: "stmt",
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,
        accountLoading: PropTypes.bool.isRequired,
        accountLoaded: PropTypes.bool.isRequired,
        account: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired,
        getAccount: PropTypes.func.isRequired,
        transactionsLoading: PropTypes.bool.isRequired,
        transactionsLoaded: PropTypes.bool.isRequired,
    }

    componentDidMount() {
        const { setTitle } = this.props;
        
        setTitle("Account Overview");
    }

    addTransaction = () => {
        const { isMobile, editTransaction, clearTransaction, history } = this.props;

        clearTransaction();
        editTransaction(null);
    
        if (isMobile) {
            console.log("On Mobile");
            history.push("/financial/transaction");
        }
    }

    toggleActionMenu = (event) => {
        event.preventDefault();
        this.setState({actionMenuOpen: true, menuAnchor: event.currentTarget});
    }

    changeFilter = (event) => {
        this.setState({filterType: event.target.value});
    }

    closeMenu = () => {
        this.setState({actionMenuOpen: false});
    }

    goToBankingURL(url, e) {
        e.stopPropagation();
        window.open(url,"target=_blank");
    }

    creditInfo() {
        const { account } = this.props;

        let utilization = account.current_balance/account.credit_limit*100;
        let available = account.credit_limit - account.current_balance;

        return (
            <Grid container spacing={2} justifyContent={"center"} style={{padding: "0em 0.5em 0.5em 0.5em"}}>
                <Grid item>
                    <InfoTile title="Utilization" content={<PercentageFormat value={utilization} displayType={'text'} decimalScale={2} />} />
                </Grid>
                <Grid item>
                    <Divider orientation="vertical" light={true} />
                </Grid>
                <Grid item>
                    <InfoTile title="Available" content={<CurrencyFormat value={available} displayType={'text'} decimalScale={2} />}
                        caption={<>Limit: <CurrencyFormat value={account.credit_limit} displayType={'text'} decimalScale={2} /></>} />
                </Grid>
            </Grid>
        );
    }

    render() {
        const { classes, account, accountLoading, accountLoaded, accountLoadError, history, isMobile } = this.props;
        const { actionMenuOpen, filterType, menuAnchor } = this.state;

        if (accountLoadError) return <Redirect to="/financial/accounts" />
        
        return (
            <Container>
                <Grid container spacing={3}>
                    <Grid item container xs={12} justifyContent="space-between">
                        <Grid item xs={6} align={"left"} mt={2} className={classes.hideForPrint}>
                            <Button variant="outlined" color="primary" size="small" 
                                onClick={() => history.push("/financial/accounts")}>Back</Button>
                        </Grid>
                        <Grid item xs={6} align={"right"} mt={2} className={classes.hideForPrint}>
                            <Button id="actionButton" variant="contained" color="primary" size="small"
                                disabled={account.id ? false : true} className={classes.hideForPrint}
                                aria-controls="actionMenu" aria-haspopup={true}
                                onClick={this.toggleActionMenu}>Actions</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        { !accountLoading && accountLoaded && account.id ?
                        <>
                            <Grid container spacing={2} justifyContent="flex-start">
                                <Grid item>
                                    <Typography variant="caption" className={classes.listCaption} style={{marginLeft: "4px"}}>
                                    {account.organization.website_url != null ?
                                        <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, account.organization.website_url)}>
                                            {account.organization.name}
                                        </Link> :
                                        account.organization.name
                                    }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <SummaryCard headerTitle={account.name} headerValue={account.current_balance}>                                
                                <Grid container spacing={2} justifyContent="space-between" style={{marginBottom: "0.5em"}}>
                                    <Grid item xs>
                                        <Select value={filterType} onChange={this.changeFilter} variant="outlined" size="small"
                                            style={{width: "100%"}}>
                                            <MenuItem value="stmt">Statement Period</MenuItem>
                                            <MenuItem value="range">Date Range</MenuItem>
                                        </Select>
                                    </Grid>
                                    { !isMobile && <>
                                        <Grid item xs>
                                            { filterType === "stmt" ? <div>&nbsp;</div> :
                                                <DateRangeSelector />
                                            }
                                        </Grid>
                                        <Grid item xs={4}>
                                            &nbsp;
                                        </Grid>
                                    </>}
                                    <Grid item xs={"auto"} className={classes.hideForPrint}>
                                        <Button id="addTransactionButton" variant="contained" color="primary" size="small"
                                            aria-controls="addTransactionButton" aria-haspopup={false}
                                            onClick={this.addTransaction}>Add Transaction</Button>
                                    </Grid>
                                    { isMobile && 
                                        <Grid item xs={12}>
                                            { filterType === "stmt" ? <div>&nbsp;</div> :
                                                <DateRangeSelector />
                                            }
                                        </Grid>
                                    }
                                </Grid>
                                { account.id && account.account_type.value === 'CR' && this.creditInfo()}
                                { account.id ? <TransactionList /> : null }
                            </SummaryCard>
                        </> : <LoadingMessage message="Loading Account Details" />
                        }
                    </Grid>
                </Grid>
                <Menu id="actionMenu" anchorEl={menuAnchor} keepMounted
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}                        
                    open={Boolean(actionMenuOpen)} onClose={this.closeMenu}>
                    <MenuItem style={{fontSize: "10pt"}} dense 
                        onClick={this.addTransaction}
                    >Add Transaction</MenuItem>
                    <MenuItem style={{fontSize: "10pt"}} dense
                        onClick={() => console.log("Show Import Transactions Modal")}
                    >Import Transactions</MenuItem>
                    <Divider />                            
                    <MenuItem style={{fontSize: "10pt"}} dense
                        onClick={() => history.push("/financial/accountinfo")}
                    >Edit Account</MenuItem>
                </Menu>
                { !isMobile ? <TransactionModal id="transactionModal" name="transactionModal" /> : null }
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    isMobile: state.auth.isMobile,
    accountLoading: state.accounts.accountLoading,
    accountLoaded: state.accounts.accountLoaded,
    accountLoadError: state.accounts.accountLoadError,
    account: state.accounts.currentAccount,
    financialCategories: state.accounts.financialCategories,
    transactionsLoading: state.transactions.transactionsLoading,
    transactionsLoaded: state.transactions.transactionsLoaded
});

const mapDispatchToProps = {
    setTitle,
    getAccount,
    getFinancialCategories,
    clearTransaction,
    editTransaction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (AccountOverview)));