import React from "react";
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Container = loadable(() => import('@mui/material/Container' /* webpackChunkName: "Layout" */));
const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@mui/material/Typography' /* webpackChunkName: "Layout" */));
const Divider = loadable(() => import('@mui/material/Divider' /* webpackChunkName: "Layout" */));

import { CurrencyFormat } from '../../common/NumberFormats'

// const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});
const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Layout" */), {fallback: <span>&nbsp;</span>});

// import { Chart, BarSeries, Tooltip } from '@devexpress/dx-react-chart-material-ui';
// import { EventTracker } from '@devexpress/dx-react-chart';

import { getNetWorth } from '../../../actions/dashboard';
import SelectInput from "@mui/material/Select/SelectInput";

const styles = theme => ({
    
});

function currencyTooltip(props) {
    const { text, targetItem } = props;

    return (
        <>
            {targetItem.series === "defaultSeriesName" ? null :
                <Typography variant="body1">{targetItem.series}</Typography>
        }
            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} />
        </>
    );
}

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

    componentDidMount() {
        this.refreshData();
    }

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

    componentDidUpdate() {
        this.refreshData();
    }

    netWorthHeader = () => {
        const { netWorthLoaded } = this.props;
        const { netWorth } = this.state;
        
        return (
            <Grid container spacing={0} justifyContent={"space-between"}>
                <Grid item>
                    <Typography variant="h5">Net Worth</Typography>
                </Grid>
                { netWorthLoaded && 
                    <Grid item xs={"auto"}>
                        <Typography variant="h5">
                            <CurrencyFormat value={netWorth} displayType={'text'} decimalScale={0} />
                        </Typography>
                    </Grid>           
                }             
            </Grid>
        );
    }

    render() {
        const { netWorthLoaded, netWorthLoading, netWorthData, ...otherProps } = this.props;
        const { totalAssets, totalLiabilities, checkingAccounts, savingsAccounts, property, investments, loans, creditCards } = this.state;

        if (netWorthLoading && !netWorthLoaded) {
            return <span>Loading...</span>
        }
        
        if (!netWorthLoading && !netWorthLoaded) {
            return (
                <SummaryCard header={this.netWorthHeader()}>
                    <Container>
                        <Typography variant="body1">
                            No data available.
                        </Typography>
                    </Container>
                </SummaryCard>
            );
        }

        const data = [
            {argument: "Investments", investments: investments.balance},
            {argument: "Property", property: property.balance},
            {argument: "Cash", cash: checkingAccounts.balance + savingsAccounts.balance},
            {argument: "Loans", loans: loans.balance},
            {argument: "Credit Cards", cards: creditCards.balance}
        ];
        
        return (
            <SummaryCard header={this.netWorthHeader()}>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item xs={5}>
                        <InfoTile title="Assets" content={<CurrencyFormat value={totalAssets} displayType={'text'} decimalScale={0} />} />
                    </Grid>
                    <Grid item xs={"auto"}>
                        <Divider dir={"vertical"} orientation="vertical" light={true} />
                    </Grid>
                    <Grid item xs={5}>
                        <InfoTile title="Liabilities" content={<CurrencyFormat value={totalLiabilities} displayType={'text'} decimalScale={0} />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider light={true} />
                    </Grid>
                    {/* <Grid item xs={12}>
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
                            <Tooltip contentComponent={currencyTooltip} />
                        </Chart>
                    </Grid> */}
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