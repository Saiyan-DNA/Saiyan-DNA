import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import { Divider, Grid, Link, List, ListItem, ListItemButton, Typography } from '@mui/material';

const AccountList = loadable(() => import('./AccountList' /* webpackChunkName: "Financial" */));
const InfoTile = loadable(() => import('../common/InfoTile' /* webpackChunkName: "Common" */));

import { CurrencyFormat } from '../common/NumberFormats'

import { getAccount } from '../../actions/accounts';

const styles = theme => ({
    listCardSubHeader: {
        color: "#737373",
        fontWeight: "bold",
        fontSize: "smaller",
        paddingTop: "10px"
    },
    accountSummary: {
        margin: "0em",
        padding: "0.5em 0em 0em 0em",
        ['@media print']: {
            paddingTop: "4px",
            paddingBottom: "4px"
        }
    },
    inlineGrid: {
        display: "inline-block"
    },
});

class BankingList extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        accountList: PropTypes.array.isRequired,
        getAccount: PropTypes.func.isRequired
    }

    accountTypeFilter(acct) {
        return acct.account_type.value == this;        
    }

    goToBankingURL(url, e) {
        e.stopPropagation();
        window.open(url,"target=_blank");
    }

    viewAccount(id) {
        const { history, getAccount } = this.props;
        
        getAccount(id);
        history.push("/financial/accountoverview");
    }

    accountSummary = (acct, classes) => {
        return (
            <div key={acct.id}>
                <ListItemButton divider style={{padding: "0px" }} onClick={() => {this.viewAccount(acct.id)}}>
                    <Grid container spacing={0} justifyContent="space-between" className={classes.accountSummary} >
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1">{acct.name}</Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant="body1">
                                    <CurrencyFormat value={acct.current_balance} displayType={'text'} decimalScale={2} />
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
                            <Grid item>
                                <Typography variant="caption" style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                    {acct.organization.website_url != null ?
                                        <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, acct.organization.website_url)}>{acct.organization.name}</Link> :
                                        acct.organization.name
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>                                
                </ListItemButton>
            </div> 
        );
    }

    bankingOverview = (checkingTotal, savingsTotal) => {
        return (
            <Grid container spacing={2} justifyContent={"center"} style={{padding: "0em 0.5em 0.5em 0.5em", marginTop: "2px"}}>
                <Grid item>
                    <InfoTile title="Checking" content={<CurrencyFormat value={checkingTotal} displayType={'text'} decimalScale={2} />} />
                </Grid>
                <Grid item xs={"auto"}>
                    <Divider orientation="vertical" light={true} />
                </Grid>
                <Grid item>
                    <InfoTile title="Savings" content={<CurrencyFormat value={savingsTotal} displayType={'text'} decimalScale={2} />} />
                </Grid>
                <Grid item xs={12}>
                    <Divider light={true} />
                </Grid>
            </Grid>
        );
    }

    render() {
        const { classes, accountList } = this.props;
        
        var checkingAccounts = accountList.filter(this.accountTypeFilter, "CK").sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));
        var savingsAccounts = accountList.filter(this.accountTypeFilter, "SV").sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));
        var checkingTotal = checkingAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0);
        var savingsTotal = savingsAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0);
        var totalBalance = checkingTotal + savingsTotal;

        return (
            <AccountList cardTitle="Banking" totalBalance={totalBalance}
                overviewContent={this.bankingOverview(checkingTotal, savingsTotal)}>
                <React.Fragment>
                    { !!checkingAccounts.length &&
                        <React.Fragment>
                            <Typography variant="body1" className={classes.listCardSubHeader}>Checking</Typography>
                            <List>
                                {checkingAccounts.map(acct => this.accountSummary(acct, classes))}
                            </List>
                        </React.Fragment>
                    }
                    { !!savingsAccounts.length &&
                        <React.Fragment>
                            <Typography variant="body1" className={classes.listCardSubHeader}>Savings</Typography>
                            <List>
                                {savingsAccounts.map(acct => this.accountSummary(acct, classes))}
                            </List>
                        </React.Fragment>
                    }
                </React.Fragment>
            </AccountList>
        );
    }
}

export default connect(null, { getAccount })(withRouter(withStyles(styles, {withTheme: true})(BankingList)));