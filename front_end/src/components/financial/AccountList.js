import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';

const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const CardHeader = loadable(() => import('@material-ui/core/CardHeader' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const Link = loadable(() => import('@material-ui/core/Link' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});

import { getAccount } from '../../actions/accounts';

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
    listCardSubHeader: {
        color: "#737373",
        fontWeight: "bold",
        fontSize: "smaller",
        paddingTop: "10px"
    },
    listCardContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(0,1,0)
    },
    accountSummary: {
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
    expandingCardContent: {
        maxHeight: "300px"
    },
    inlineGrid: {
        display: "inline-block"
    },
});

const AccountTypes = {
    BANKING: 'Banking',
    CREDIT: 'Credit',
    LOAN: 'Loan',
    INVESTMENT: 'Investment'       
}

class AccountList extends React.Component {
    state = {

    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        accountType: PropTypes.oneOf(["Banking", "Credit", "Loan", "Investment"]).isRequired,
        accounts: PropTypes.array.isRequired,
        getAccount: PropTypes.func.isRequired
    }

    accountTypeFilter(acct) {
        return acct.account_type == this;        
    }

    goToBankingURL(url, e) {
        e.stopPropagation();
        window.open(url,"target=_blank");
    }

    viewAccount(id) {
        this.props.getAccount(id);
        this.props.history.push("/financial/accountoverview");
    }

    render() {
        const { classes, cardTitle, accountType, accounts } = this.props;
        
        var accountList = [];
        var checkingAccounts = null;
        var savingsAccounts = null;

        var totalBalance = 0.00;
        var totalLimit = 0.00;
        var totalAvailable = 0.00;

        switch (accountType) {
            case AccountTypes.BANKING:
                accountList = accounts.filter(account => account.account_type.includes('CK') || account.account_type.includes('SV'));
                checkingAccounts = accountList.filter(this.accountTypeFilter, "CK").sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));;
                savingsAccounts = accountList.filter(this.accountTypeFilter, "SV").sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));;
                break;
            case AccountTypes.CREDIT:
                accountList = accounts.filter(account => account.account_type.includes("CR"));
                totalLimit = accountList.reduce((cnt, acct) => cnt + acct.credit_limit, 0);
                break;
            case AccountTypes.LOAN:
                accountList = accounts.filter(account => account.account_type.includes("LN"));
                break;
            case AccountTypes.INVESTMENT:
                accountList = accounts.filter(account => account.account_type.includes("IN"));
                break;
            default:
                break;
        }

        // Sort by account balance (descending) then by account name
        accountList.sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));      
        
        totalBalance = accountList.reduce((cnt, acct) => cnt + acct.current_balance, 0);
        totalAvailable = totalLimit - totalBalance;

        return (
            <Card elevation={4} className={classes.listCard}>
                <CardHeader className={classes.listCardHeader}
                title={
                    <Grid container spacing={0} justify={"space-between"}>
                        <Grid item>
                            <Typography variant="h5">{cardTitle}</Typography>
                        </Grid>
                        <Grid item xs={"auto"}>
                            <Typography variant="h5">
                                <NumberFormat value={totalBalance} displayType={'text'} 
                                    thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
                            </Typography>
                        </Grid>                        
                    </Grid>
                } />
                <CardContent name="accountListCard" className={classes.listCardContent}>
                    { accountType == AccountTypes.CREDIT &&
                        <Grid container spacing={2} justify={"center"} style={{marginTop: "2px", borderBottom: "0.5px solid #DCDCDC"}}>
                            <Grid item xs={6}>
                                <Typography variant="h6" align="center">Utilization</Typography>
                                <Typography variant="body1" align="center">
                                    <NumberFormat value={totalBalance/totalLimit*100} displayType={'text'} 
                                        thousandSeparator={true} suffix={'%'} decimalScale={2} fixedDecimalScale={true} />
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" align="center">Available</Typography>
                                <Typography variant="body1" align="center">
                                    <NumberFormat value={totalAvailable} displayType={'text'} 
                                        thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                    { accountType == AccountTypes.BANKING &&
                        <>
                            { checkingAccounts.length &&
                                <>
                                    <Typography variant="body1" className={classes.listCardSubHeader}>Checking</Typography>
                                    <List>
                                        {
                                            accountList.filter(this.accountTypeFilter, "CK").map(acct => (
                                                <div key={acct.id}>
                                                    <ListItem button className={classes.accountSummary} 
                                                        onClick={() => {this.viewAccount(acct.id)}}>
                                                        <Grid container spacing={0} justify="space-between">
                                                            <Grid container item spacing={0} xs={12} justify="space-between">
                                                                <Grid item>
                                                                    <Typography variant="body1">{acct.name}</Typography>
                                                                </Grid>
                                                                <Grid item xs={"auto"}>
                                                                    <Typography variant="body1">
                                                                        <NumberFormat value={acct.current_balance} displayType={'text'}
                                                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container item spacing={0} xs={12} justify="space-between">
                                                                <Grid item>
                                                                    <Typography variant="caption" style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                                                        {acct.organization.website_url != null ?
                                                                            <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, acct.organization.website_url)}>{acct.organization.name}</Link> :
                                                                            acct.financial_institution.name
                                                                        }
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>                                
                                                    </ListItem>
                                                </div>       
                                            ))
                                        }
                                    </List>
                                </>
                            }
                            { savingsAccounts.length &&
                                <>
                                    <Typography variant="body1" className={classes.listCardSubHeader}>Savings</Typography>
                                    <List>
                                        {
                                            accountList.filter(this.accountTypeFilter, "SV").map(acct => (
                                                <div key={acct.id}>
                                                    <ListItem button className={classes.accountSummary} 
                                                        onClick={() => {this.viewAccount(acct.id)}}>
                                                        <Grid container spacing={0} justify="space-between">
                                                            <Grid container item spacing={0} xs={12} justify="space-between">
                                                                <Grid item>
                                                                    <Typography variant="body1">{acct.name}</Typography>
                                                                </Grid>
                                                                <Grid item xs={"auto"}>
                                                                    <Typography variant="body1">
                                                                        <NumberFormat value={acct.current_balance} displayType={'text'}
                                                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container item spacing={0} xs={12} justify="space-between">
                                                                <Grid item>
                                                                    <Typography variant="caption" style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                                                        {acct.organization.website_url != null ?
                                                                            <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, acct.organization.website_url)}>{acct.organization.name}</Link> :
                                                                            acct.financial_institution.name
                                                                        }
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>                                
                                                    </ListItem>
                                                </div>       
                                            ))
                                        }
                                    </List>
                                </>
                            }    
                        </>
                    }
                    {accountType != AccountTypes.BANKING && 
                        <List>
                            { accountList.map(acct => (
                                <div key={acct.id}>
                                    <ListItem button className={classes.accountSummary} 
                                        onClick={() => {this.viewAccount(acct.id)}}>
                                        <Grid container spacing={0} justify="space-between">
                                            <Grid container item spacing={0} xs={12} justify="space-between">
                                                <Grid item>
                                                    <Typography variant="body1">{acct.name}</Typography>
                                                </Grid>
                                                <Grid item xs={"auto"}>
                                                    <Typography variant="body1">
                                                        <NumberFormat value={acct.current_balance} displayType={'text'}
                                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container item spacing={0} xs={12} justify="space-between">
                                                <Grid item>
                                                    <Typography variant="caption" style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                                        {acct.organization.website_url != null ?
                                                            <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, acct.organization.website_url)}>{acct.organization.name}</Link> :
                                                            acct.financial_institution.name
                                                        }
                                                    </Typography>
                                                </Grid>
                                                { accountType == AccountTypes.CREDIT &&
                                                    <Grid item xs={"auto"}>
                                                        <Typography variant="caption"  style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                                            <NumberFormat value={acct.credit_limit - acct.current_balance} displayType={'text'}
                                                                thousandSeparator={true} prefix={'$'} decimalScale={0} fixedDecimalScale={true} />&nbsp;available
                                                        </Typography>
                                                    </Grid>
                                                }
                                            </Grid>
                                        </Grid>                                
                                    </ListItem>
                                </div>                                
                            ))}
                        </List>
                    }
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    accounts: state.accounts.accounts
});

export default connect(mapStateToProps, { getAccount })(withStyles(styles, {withTheme: true})(AccountList));