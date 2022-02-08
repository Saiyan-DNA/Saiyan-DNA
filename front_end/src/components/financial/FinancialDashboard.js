import React from "react";
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Container = loadable(() => import('@mui/material/Container' /* webpackChunkName: "Material-Layout" */));
const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Material-Layout" */));

import {BankingPanel, CreditCardsPanel, CreditScorePanel, NetWorthPanel, DebtIncomePanel, LoansPanel} from './dashboard';
import { MonthSelector } from "../common";

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
                    <Grid item xs={12}>
                        <MonthSelector variant="outlined" hideFuture={true} />
                    </Grid>
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