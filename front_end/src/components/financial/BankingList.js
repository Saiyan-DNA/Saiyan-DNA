import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material-Layout" */));

const Link = loadable(() => import('@material-ui/core/Link' /* webpackChunkName: "Material-Navigation" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material-Layout" */));
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material-Layout" */));

const AccountList = loadable(() => import('./AccountList' /* webpackChunkName: "Financial" */));

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
        return acct.account_type == this;        
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
                <ListItem button className={classes.accountSummary} 
                    onClick={() => {this.viewAccount(acct.id)}}>
                    <Grid container spacing={0} justifyContent="space-between">
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1">{acct.name}</Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant="body1">
                                    <CurrencyFormat value={acct.current_balance} displayType={'text'} />
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
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
        );
    }

    render() {
        const { classes, accountList } = this.props;
        
        var checkingAccounts = accountList.filter(this.accountTypeFilter, "CK").sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));
        var savingsAccounts = accountList.filter(this.accountTypeFilter, "SV").sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));

        var totalBalance = 0.00;
       
        totalBalance += checkingAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0);
        totalBalance += savingsAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0);

        return (
            <AccountList cardTitle="Banking" totalBalance={totalBalance}>
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