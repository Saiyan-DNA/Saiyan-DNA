import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Divider, Grid } from '@mui/material';
import { withStyles } from '@mui/styles';

const CurrencyTooltip = loadable(() => import('../controls/CurrencyTooltip' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const PercentageFormat = loadable(() => import('../../common/PercentageFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

const Chart = loadable(() => import('@devexpress/dx-react-chart-material-ui' /* webpackChunkName: "Chart" */).then(m => m.Chart), {fallback: <span>&nbsp;</span>});
const PieSeries = loadable(() => import('@devexpress/dx-react-chart-material-ui' /* webpackChunkName: "Chart" */).then(m => m.PieSeries), {fallback: <span>&nbsp;</span>});
const Tooltip = loadable(() => import('@devexpress/dx-react-chart-material-ui' /* webpackChunkName: "Chart" */).then(m => m.Tooltip), {fallback: <span>&nbsp;</span>});
const EventTracker = loadable(() => import('@devexpress/dx-react-chart' /* webpackChunkName: "Chart" */).then(m => m.EventTracker), {fallback: <span>&nbsp;</span>});
const Palette = loadable(() => import('@devexpress/dx-react-chart' /* webpackChunkName: "Chart" */).then(m => m.Palette), {fallback: <span>&nbsp;</span>});

import { getNetWorth } from '../../../actions/dashboard';

const styles = theme => ({ });

class LoansPanel extends React.Component {
    state = {
        totalOwed: 0,
        totalLoaned: 0,
        totalPaid: 0,
        percentPaid: 0,
        count: 0,
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

    componentDidMount() { this.refreshData(); }

    componentDidUpdate() { this.refreshData(); }

    refreshData() {
        const { netWorthLoading, netWorthLoaded, getNetWorth, netWorthData} = this.props;
        const { accountsLoading, assetsLoading } = this.props;
        const { current } = this.state;

        if (!accountsLoading && !assetsLoading && !netWorthLoading && !netWorthLoaded) {
            getNetWorth();
            return;
        }

        if (!current && netWorthLoaded && !netWorthLoading) {
            if (netWorthData.loans.balance != this.state.totalOwed) {
                this.setState({
                    totalOwed: netWorthData.loans.balance,
                    totalLoaned: netWorthData.loans.limit,
                    totalPaid: netWorthData.loans.paid,
                    percentPaid: netWorthData.loans.percentPaid,
                    count: netWorthData.loans.count,
                    current: true
                });
            }
        }
    }

    render() {
        const { totalOwed, totalPaid, percentPaid } = this.state;        
        const loandata = [{argument: "Paid", value: totalPaid}, {argument: "Owed", value: totalOwed}];

        return (
            <SummaryCard headerTitle="Loans" headerValue={totalOwed} valueScale={0}>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item>
                        <InfoTile title="Paid" content={<PercentageFormat value={percentPaid} displayType={'text'} decimalScale={2} />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider light={true} />
                    </Grid>
                    <Grid item xs={12}>
                        <Chart data={loandata} height={180}>
                            <Palette scheme={["#11823b", "#ffb21b"]} />
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
    (LoansPanel));