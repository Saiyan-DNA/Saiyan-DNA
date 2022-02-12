import React from "react";
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Divider, Grid, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

import { CurrencyFormat, PercentageFormat } from '../../common/NumberFormats'

const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Layout" */), {fallback: <span>&nbsp;</span>});

import { Chart, PieSeries, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, Palette } from '@devexpress/dx-react-chart';

import { getNetWorth } from '../../../actions/dashboard';


const styles = theme => ({ });

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

class CreditCardsPanel extends React.Component {
    state = {
        totalOwed: 0,
        totalAvailable: 0,
        totalLimit: 0,
        utilization: 0,
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

    componentDidMount() {
        this.refreshAccounts();
    }

    componentDidUpdate() {
        this.refreshAccounts();
    }

    refreshAccounts() {
        const { netWorthLoading, netWorthLoaded, getNetWorth, netWorthData} = this.props;
        const { accountsLoading, assetsLoading } = this.props;
        const { current } = this.state;

        if (!accountsLoading && !assetsLoading && !netWorthLoading && !netWorthLoaded) {
            getNetWorth();
            return;
        }

        if (!current && netWorthLoaded && !netWorthLoading) {
            if (netWorthData.creditCards.balance != this.state.totalOwed) {
                this.setState({
                    totalOwed: netWorthData.creditCards.balance,
                    totalAvailable: netWorthData.creditCards.available,
                    totalLimit: netWorthData.creditCards.limit,
                    utilization: netWorthData.creditCards.utilization,
                    current: true
                });
            }
        }
    }

    render() {
        const { ...otherProps } = this.props;
        const { totalOwed, totalAvailable, totalLimit, utilization, count } = this.state;
        
        const creditdata = [{argument: "Owed", value: totalOwed}, {argument: "Available", value: totalAvailable}];

        return (
            <SummaryCard headerTitle="Credit Cards" headerValue={totalOwed} valueScale={0}>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item>
                        <InfoTile title="Utilization" content={<PercentageFormat value={utilization} displayType={'text'} decimalScale={2} />} />
                    </Grid>
                    <Grid item>
                        <Divider dir={"vertical"} orientation="vertical" light={true} />
                    </Grid>
                    <Grid item>
                        <InfoTile title="Available" content={<CurrencyFormat value={totalAvailable} displayType={'text'} decimalScale={0} />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider light={true} />
                    </Grid>
                    <Grid item xs={12}>
                        <Chart data={creditdata} height={200}>
                            <Palette scheme={["#ffb21b", "#11823b"]} />
                            <PieSeries valueField="value" argumentField="argument" innerRadius={0.66} />
                            <EventTracker />
                            <Tooltip contentComponent={currencyTooltip} />
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
    getNetWorth
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (CreditCardsPanel)));