import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Button, Container, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Common" */));
const SummaryCard = loadable(() => import('../common/SummaryCard' /* webpackChunkName: "Common" */));

const AccountList = loadable(() => import('./AccountList' /* webpackChunkName: "Financial" */));
const BankingList = loadable(() => import('./BankingList' /* webpackChunkName: "Financial" */));
const CreditList = loadable(() => import('./CreditList' /* webpackChunkName: "Financial" */));

import { getAccounts, clearAccount } from '../../actions/accounts';
import { clearTransactions } from '../../actions/transactions';
import { setTitle } from '../../actions/navigation';

const styles = theme => ({
    inlineGrid: {
        display: "inline-block"
    },
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    }
});

class FinancialAccounts extends React.Component {
    state = {
        showClosedAccounts: false
    }

    static propTypes = {
        bankAccounts: PropTypes.array.isRequired,
        creditAccounts: PropTypes.array.isRequired,
        loanAccounts: PropTypes.array.isRequired,
        investmentAccounts: PropTypes.array.isRequired,
        getAccounts: PropTypes.func.isRequired,
        accountsLoading: PropTypes.bool.isRequired,
        accountsLoaded: PropTypes.bool.isRequired,
        accountDeleting: PropTypes.bool.isRequired,
        clearAccount: PropTypes.func.isRequired,
        clearTransactions: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { clearAccount, clearTransactions, setTitle, getAccounts, accountsLoaded, accountsLoading } = this.props;
        
        setTitle("Accounts");
        clearAccount();
        clearTransactions();

        if (!accountsLoaded && !accountsLoading) {
            getAccounts();
        }
    }

    componentDidUpdate() {
        const { accountsLoading, accountsLoaded, accountDeleting, getAccounts } = this.props;
        
        if (!accountsLoaded && !accountsLoading && !accountDeleting) {
            getAccounts();
        }
    }

    onChange = (e) => {
        var newState = this.state;

        if (e.target.name == "showClosedAccounts") {
            newState.showClosedAccounts = e.target.checked;
        }

        this.setState(newState)
    }

    actionAddAccount = () => {
        this.props.clearAccount();
        this.props.history.push("/financial/accountinfo");
    }

    render() {
        const { classes, accountsLoading, accountsLoaded, history } = this.props;
        const { bankAccounts, creditAccounts, loanAccounts, investmentAccounts } = this.props;
        const { showClosedAccounts } = this.state;

        if (!accountsLoaded || accountsLoading) {
            return <LoadingMessage message="Loading Accounts..." />
        }

        var filteredBankAccounts = []
        var filteredCreditAccounts = []
        var filteredLoanAccounts = []
        var filteredInvestmentAccounts = []

        if (!showClosedAccounts) {
            filteredBankAccounts = bankAccounts.filter(acct => acct.is_closed == false);
            filteredCreditAccounts = creditAccounts.filter(acct => acct.is_closed == false);
            filteredLoanAccounts = loanAccounts.filter(acct => acct.is_closed == false);
            filteredInvestmentAccounts = investmentAccounts.filter(acct => acct.is_closed == false);
        }
        else {
            filteredBankAccounts = bankAccounts;
            filteredCreditAccounts = creditAccounts;
            filteredLoanAccounts = loanAccounts;
            filteredInvestmentAccounts = investmentAccounts;
        }

        var totalAccounts = bankAccounts.length + creditAccounts.length + loanAccounts.length + investmentAccounts.length

        return (
            <Container>
                <Grid container spacing={2} justifyContent={"space-between"}>
                    <Grid item sm={6} mt={2} justifyContent="center" className={classes.hideForPrint}>
                        <FormControlLabel label={<Typography variant="body2">Show Closed Accounts</Typography>}
                            control={<Switch id="showClosedAccounts" name="showClosedAccounts" checked={showClosedAccounts} onChange={this.onChange.bind(this)} />} />
                    </Grid>
                    <Grid item xs={"auto"} sm={6} align={"right"} mt={2} className={classes.hideForPrint}>
                        <Button variant={"contained"} color={"primary"} size="small" 
                            onClick={this.actionAddAccount}>Add Account</Button>
                    </Grid>
                    { totalAccounts > 0 ? null :
                        <Grid item xs={12}>
                            <SummaryCard header="No Accounts Found">
                                <Grid container justifyContent="center">
                                    <Grid item>
                                        <Typography variant="body1">You do not have any accounts yet. Click "Add Account" to create your first account.</Typography>
                                    </Grid>
                                </Grid>
                            </SummaryCard>
                        </Grid>
                    }
                    { !!bankAccounts.length &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <BankingList history={history} accountList={filteredBankAccounts} />
                        </Grid>
                    }
                    { !!creditAccounts.length &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <CreditList history={history} accountList={filteredCreditAccounts}/>
                        </Grid>
                    }
                    { !!loanAccounts.length &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <AccountList cardTitle="Loans" history={history} accountList={filteredLoanAccounts} 
                                totalBalance={filteredLoanAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0)} />
                        </Grid>
                    }
                    { !!investmentAccounts.length > 0 &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <AccountList cardTitle="Investments" history={history} accountList={filteredInvestmentAccounts} 
                                totalBalance={filteredInvestmentAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0)} />
                        </Grid>
                    }
                </Grid>
            </Container>            
        )
    }
}

const mapStateToProps = state => ({
    bankAccounts: state.accounts.accounts.filter(acct => acct.account_type.value.includes("CK") || acct.account_type.value.includes("SV")),
    creditAccounts: state.accounts.accounts.filter(acct => acct.account_type.value.includes("CR")),
    loanAccounts: state.accounts.accounts.filter(acct => acct.account_type.value.includes("LN")),
    investmentAccounts: state.accounts.accounts.filter(acct => acct.account_type.value.includes("IN")),
    accountsLoading: state.accounts.accountsLoading,
    accountsLoaded: state.accounts.accountsLoaded,
    accountDeleting: state.accounts.accountDeleting
});

const mapDispatchToProps = {
    getAccounts,
    clearAccount,
    clearTransactions,
    setTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(FinancialAccounts));
