import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Container, Grid } from '@mui/material';
import { withStyles } from '@mui/styles';

const BankingPanel = loadable(() => import('./dashboard/BankingPanel' /* webpackChunkName: "Dashboard" */), {fallback: <div>&nbsp;</div>});
const CreditCardsPanel = loadable(() => import('./dashboard/CreditCardsPanel' /* webpackChunkName: "Dashboard" */), {fallback: <div>&nbsp;</div>});
const CreditScorePanel = loadable(() => import('./dashboard/CreditScorePanel' /* webpackChunkName: "Dashboard" */), {fallback: <div>&nbsp;</div>});
const NetWorthPanel = loadable(() => import('./dashboard/NetWorthPanel' /* webpackChunkName: "Dashboard" */), {fallback: <div>&nbsp;</div>});
const DebtIncomePanel = loadable(() => import('./dashboard/DebtIncomePanel' /* webpackChunkName: "Dashboard" */), {fallback: <div>&nbsp;</div>});
const LoansPanel = loadable(() => import('./dashboard/LoansPanel' /* webpackChunkName: "Dashboard" */), {fallback: <div>&nbsp;</div>});

import { setTitle } from '../../actions/navigation';

const styles = theme => ({
    dashboard: {
        border: "1px solid #DCDCDC",
        padding: "0px",
        margin: "12px",
    }
});

class FinancialDashboard extends React.Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,
        currentUser: PropTypes.object.isRequired,
        selectedMonth: PropTypes.string.isRequired,
    }

    componentDidMount() {
        const { setTitle } = this.props;

        setTitle("Financials");
    }

    render() {
        const { selectedMonth } = this.props;

        return (
            <Container>
                <Grid container spacing={2} justifyContent={"flex-start"}>
                    <Grid item xs={12} sm={6} md={4} lg={3}><NetWorthPanel month={selectedMonth} /></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}><BankingPanel month={selectedMonth} /></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}><CreditCardsPanel month={selectedMonth} /></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}><LoansPanel month={selectedMonth} /></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}><CreditScorePanel month={selectedMonth} /></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}><DebtIncomePanel month={selectedMonth} /></Grid>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    isMobile: state.auth.isMobile,
    selectedMonth: state.navigation.selectedMonth,
});

const mapDispatchToProps = {
    setTitle,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (FinancialDashboard)));