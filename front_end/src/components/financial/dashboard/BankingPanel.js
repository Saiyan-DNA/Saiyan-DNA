import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Divider, Grid } from '@mui/material';
import { withStyles } from '@mui/styles';

const CurrencyFormat = loadable(() => import('../../common/CurrencyFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const CurrencyTooltip = loadable(() => import('../controls/CurrencyTooltip' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

const Chart = loadable(() => import('@devexpress/dx-react-chart-material-ui' /* webpackChunkName: "Chart" */).then(m => m.Chart), {fallback: <span>&nbsp;</span>});
const PieSeries = loadable(() => import('@devexpress/dx-react-chart-material-ui' /* webpackChunkName: "Chart" */).then(m => m.PieSeries), {fallback: <span>&nbsp;</span>});
const Tooltip = loadable(() => import('@devexpress/dx-react-chart-material-ui' /* webpackChunkName: "Chart" */).then(m => m.Tooltip), {fallback: <span>&nbsp;</span>});
const EventTracker = loadable(() => import('@devexpress/dx-react-chart' /* webpackChunkName: "Chart" */).then(m => m.EventTracker), {fallback: <span>&nbsp;</span>});
const Palette = loadable(() => import('@devexpress/dx-react-chart' /* webpackChunkName: "Chart" */).then(m => m.Palette), {fallback: <span>&nbsp;</span>});

import { getNetWorth } from '../../../actions/dashboard';

const styles = theme => ({ });

class BankingPanel extends React.Component {
    state = {
        totalCash: 0.00,
        totalChecking: 0.00,
        checkingCount: 0.00,
        totalSavings: 0.00,
        savingsCount: 0.00,
        current: false
    };

    static propTypes = {
        getNetWorth: PropTypes.func.isRequired,
        netWorthData: PropTypes.object.isRequired,
        netWorthLoading: PropTypes.bool.isRequired,
        netWorthLoaded: PropTypes.bool.isRequired,
        accountsLoading: PropTypes.bool.isRequired,
        assetsLoading: PropTypes.bool.isRequired,
    }

    componentDidMount() { this.refreshAccounts(); }

    componentDidUpdate() { this.refreshAccounts(); }

    refreshAccounts() {
        const { netWorthLoading, netWorthLoaded, getNetWorth, netWorthData} = this.props;
        const { accountsLoading, assetsLoading } = this.props;
        const { current } = this.state;

        if (!accountsLoading && !assetsLoading && !netWorthLoading && !netWorthLoaded) {
            getNetWorth();
            return;
        }

        if (!current && netWorthLoaded && !netWorthLoading) {
            var totalCash = netWorthData.checkingAccounts.balance + netWorthData.savingsAccounts.balance;

            if (totalCash != this.state.totalCash) {
                this.setState({
                    totalCash: totalCash,
                    totalChecking: netWorthData.checkingAccounts.balance,
                    checkingCount: netWorthData.checkingAccounts.count,
                    totalSavings: netWorthData.savingsAccounts.balance,
                    savingsCount: netWorthData.savingsAccounts.count,
                    current: true
                });
            }
        }
    }

    render() {
        const { ...otherProps } = this.props;
        const { totalCash, totalChecking, totalSavings } = this.state;
        
        const bankingdata = [{argument: "Checking", value: totalChecking}, {argument: "Savings", value: totalSavings}];

        return (
            <SummaryCard headerTitle="Banking" headerValue={totalCash} valueScale={0}>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item>
                        <InfoTile title="Checking" content={<CurrencyFormat value={totalChecking} displayType={'text'} decimalScale={0} />} />
                    </Grid>
                    <Grid item>
                        <Divider dir={"vertical"} orientation="vertical" light={true} />
                    </Grid>
                    <Grid item>
                        <InfoTile title="Savings" content={<CurrencyFormat value={totalSavings} displayType={'text'} decimalScale={0} />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider light={true} />
                    </Grid>
                    <Grid item xs={12}>
                        <Chart data={bankingdata} height={180}>
                            <Palette scheme={["#48bf53", "#11823b"]} />
                            <PieSeries valueField="value" argumentField="argument" innerRadius={0.66} />
                            <EventTracker />
                            <Tooltip contentComponent={CurrencyTooltip} />
                        </Chart>
                    </Grid>
                </Grid>
            </SummaryCard>
        );
    }
}

const mapStateToProps = state => ({
    accountsLoaded: state.accounts.accountsLoaded,
    accountsLoading: state.accounts.accountsLoading,
    assetsLoaded: state.assets.assetsLoaded,
    assetsLoading: state.assets.assetsLoading,
    netWorthLoading: state.dashboard.netWorthLoading,
    netWorthLoaded: state.dashboard.netWorthLoaded,
    netWorthData: state.dashboard.netWorthData, 
});

const mapDispatchToProps = {
    getNetWorth,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (BankingPanel));