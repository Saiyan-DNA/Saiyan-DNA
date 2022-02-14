import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Divider, Grid } from '@mui/material';
import { withStyles } from '@mui/styles';

import { CurrencyFormat } from '../../common/NumberFormats';

const CurrencyTooltip = loadable(() => import('../controls/CurrencyTooltip' /* webpackChunkName: "Financial" */), { fallback: <div>&nbsp;</div> });
const LoadingMessage = loadable(() => import('../../common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});
const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Layout" */), {fallback: <span>&nbsp;</span>});

import { Chart, BarSeries, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';

import { getNetWorth } from '../../../actions/dashboard';

const styles = theme => ({});

class NetWorthPanel extends React.Component {
    state = {
        netWorth: 0.0,
        totalAssets: 0.0,
        totalLiabilities: 0.0,
        checkingAccounts: {},
        savingsAccounts: {},
        property: {},
        investments: {},
        loans: {},
        creditCards: {},
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

    refreshData = () => {
        const { netWorthLoading, netWorthLoaded, getNetWorth, netWorthData} = this.props;
        const { accountsLoading, assetsLoading } = this.props;
        const { current } = this.state;

        const { netWorth } = this.state;

        if (!accountsLoading && !assetsLoading && !netWorthLoading && !netWorthLoaded) {
            getNetWorth();
            return;
        }

        if (!current && netWorthLoaded && !netWorthLoading && netWorthData.net_worth !== netWorth) {
            this.setState({
                netWorth: netWorthData.netWorth,
                totalAssets: netWorthData.totalAssets,
                totalLiabilities: netWorthData.totalLiabilities,
                checkingAccounts: netWorthData.checkingAccounts,
                savingsAccounts: netWorthData.savingsAccounts,
                property: netWorthData.property,
                investments: netWorthData.investments,
                loans: netWorthData.loans,
                creditCards: netWorthData.creditCards,
                current: true
            });
        }
    }    

    render() {
        const { netWorthLoaded, netWorthLoading, netWorthData, ...otherProps } = this.props;
        const { totalAssets, totalLiabilities, checkingAccounts, savingsAccounts, property, investments, loans, creditCards } = this.state;

        if (!netWorthLoaded) {
            return <LoadingMessage message="Loading Net Worth" />;
        }

        const data = [
            {argument: "Investments", investments: investments.balance},
            {argument: "Property", property: property.balance},
            {argument: "Cash", cash: checkingAccounts.balance + savingsAccounts.balance},
            {argument: "Loans", loans: loans.balance},
            {argument: "Credit Cards", cards: creditCards.balance}
        ];
        
        return (
            <SummaryCard headerTitle="Net Worth" headerValue={netWorthData.netWorth}>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item>
                        <InfoTile title="Assets" content={<CurrencyFormat value={totalAssets} displayType={'text'} decimalScale={0} />} />
                    </Grid>
                    <Grid item>
                        <Divider dir={"vertical"} orientation="vertical" light={true} />
                    </Grid>
                    <Grid item>
                        <InfoTile title="Liabilities" content={<CurrencyFormat value={totalLiabilities} displayType={'text'} decimalScale={0} />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider light={true} />
                    </Grid>
                    <Grid item xs={12}>
                        <Chart data={data} height={180}>
                            { investments.count > 0 &&
                                <BarSeries name="Investments" valueField="investments" argumentField="argument" color={"#004d25"} />
                            }
                            { property.count > 0 &&
                                <BarSeries name="Property" valueField="property" argumentField="argument" color={"#11823b"} />
                            }
                            { checkingAccounts.count + savingsAccounts.count > 0 &&
                                <BarSeries name="Cash" valueField="cash" argumentField="argument" color={"#48bf53"} />
                            }
                            { loans.count > 0 &&
                                <BarSeries name="Loans" valueField="loans" argumentField="argument" color={"#f97300"} />                                        
                            }
                            { creditCards.count > 0 &&
                                <BarSeries name="Credit Cards" valueField="cards" argumentField="argument" color={"#ffb21b"} />
                            }
                            <EventTracker />
                            <Tooltip contentComponent={CurrencyTooltip} />
                        </Chart>
                    </Grid>
                </Grid>
            </SummaryCard>
        )
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (NetWorthPanel)));