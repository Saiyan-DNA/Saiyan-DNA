import React from "react";
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@mui/material/Typography' /* webpackChunkName: "Layout" */));
const Divider = loadable(() => import('@mui/material/Divider' /* webpackChunkName: "Layout" */));

import { CurrencyFormat, PercentageFormat } from '../../common/NumberFormats'

// const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});
const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Layout" */), {fallback: <span>&nbsp;</span>});

// import { Chart, PieSeries, Tooltip } from '@devexpress/dx-react-chart-material-ui';
// import { EventTracker, Palette } from '@devexpress/dx-react-chart';

import { getNetWorth } from '../../../actions/dashboard';

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

    componentDidMount() {
        this.refreshData();
    }

    componentDidUpdate() {
        this.refreshData();
    }

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
        const { ...otherProps } = this.props;
        const { totalOwed, totalPaid, percentPaid } = this.state;
        
        const loandata = [{argument: "Paid", value: totalPaid}, {argument: "Owed", value: totalOwed}];

        return (
            <SummaryCard header={
                <Grid container spacing={0} justifyContent={"space-between"}>
                    <Grid item>
                        <Typography variant="h5">Loans</Typography>
                    </Grid>
                    <Grid item xs={"auto"}>
                        <Typography variant="h5">
                            <CurrencyFormat value={totalOwed} displayType={'text'} decimalScale={0} />
                        </Typography>
                    </Grid>                        
                </Grid>}>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item>
                        <InfoTile title="Paid" content={<PercentageFormat value={percentPaid} displayType={'text'} decimalScale={2} />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider light={true} />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <Chart data={loandata} height={180}>
                            <Palette scheme={["#11823b", "#ffb21b"]} />
                            <PieSeries valueField="value" argumentField="argument" innerRadius={0.66} />
                            <EventTracker />
                            <Tooltip contentComponent={currencyTooltip} />
                        </Chart>
                    </Grid> */}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (LoansPanel)));