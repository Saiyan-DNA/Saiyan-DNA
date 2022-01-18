import React from "react";
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});
const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});

import { PercentageFormat, CurrencyFormat } from '../common/NumberFormats'
const AccountList = loadable(() => import('./AccountList' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>});
const InfoTile = loadable(() => import('../common/InfoTile' /* webpackChunkName: "General" */));

class CreditList extends React.Component {
    static propTypes = {
        accountList: PropTypes.array.isRequired,
    }

    accountTypeFilter(acct) {
        return acct.account_type == this;        
    }

    creditOverview = (utilization, availableAmount) => {
        return (
            <Grid container spacing={2} justifyContent={"center"} style={{padding: "0em 0.5em 0.5em 0.5em", marginTop: "2px", borderBottom: "0.5px solid #DCDCDC"}}>
                <Grid item>
                    <InfoTile title="Utilization" content={<PercentageFormat value={utilization} displayType={'text'} decimalScale={2} />} />
                </Grid>
                <Grid item xs={"auto"}>
                    <Divider orientation="vertical" light={true} />
                </Grid>
                <Grid item>
                    <InfoTile title="Available" content={<CurrencyFormat value={availableAmount} displayType={'text'} decimalScale={2} />} />
                </Grid>
            </Grid>
        );
    }

    render() {
        const { accountList } = this.props;
        
        var creditAccounts = accountList.filter(this.accountTypeFilter, "CR").sort((a, b) => b.current_balance - a.current_balance || a.name.localeCompare(b.name));
        var totalBalance = creditAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0);
        var totalLimit = creditAccounts.reduce((cnt, acct) => cnt + acct.credit_limit, 0);
        var totalAvailable = totalLimit - totalBalance;

        return (
            <AccountList cardTitle="Credit Cards" totalBalance={totalBalance}
                overviewContent={this.creditOverview(totalBalance/totalLimit*100,totalAvailable)} 
                accountList={creditAccounts} />
        );
    }
}

export default CreditList;