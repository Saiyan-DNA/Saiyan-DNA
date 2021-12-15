import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Navigation" */), {fallback: <div>&nbsp;</div>});
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});

const SummaryCard = loadable(() => import('../common/SummaryCard' /* webpackChunkName: "General" */), {fallback: <div>&nbsp;</div>});
const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "General" */), {fallback: <div>&nbsp;</div>});
const AccountList = loadable(() => import('./AccountList' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>});
const BankingList = loadable(() => import('./BankingList' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>});
const CreditList = loadable(() => import('./CreditList' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>});

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

    actionAddAccount = () => {
        this.props.clearAccount();
        this.props.history.push("/financial/accountinfo");
    }

    render() {
        const { classes, accountsLoading, accountsLoaded, history } = this.props;
        const { bankAccounts, creditAccounts, loanAccounts, investmentAccounts } = this.props;

        if (!accountsLoaded || accountsLoading) {
            return <LoadingMessage message="Loading Accounts..." />
        }

        var totalAccounts = bankAccounts.length + creditAccounts.length + loanAccounts.length + investmentAccounts.length

        return (
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} align={"right"} mt={2} className={classes.hideForPrint}>
                        <Button variant={"contained"} color={"primary"} size="small" 
                            onClick={this.actionAddAccount}>Add Account</Button>
                    </Grid>
                    { totalAccounts > 0 ? null :
                        <Grid item xs={12}>
                            <SummaryCard header="No Accounts Found">
                                <Grid container justify="center">
                                    <Grid item>
                                        <Typography variant="body1">You do not have any accounts yet. Click "Add Account" to create your first account.</Typography>
                                    </Grid>
                                </Grid>
                            </SummaryCard>
                        </Grid>
                    }
                    { !!bankAccounts.length &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <BankingList history={history} accountList={bankAccounts} />
                        </Grid>
                    }
                    { !!creditAccounts.length &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <CreditList history={history} accountList={creditAccounts}/>
                        </Grid>
                    }
                    { !!loanAccounts.length &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <AccountList cardTitle="Loans" history={history} accountList={loanAccounts} 
                                totalBalance={loanAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0)} />
                        </Grid>
                    }
                    { !!investmentAccounts.length > 0 &&
                        <Grid item xs={12} sm={6} className={classes.inlineGrid}>
                            <AccountList cardTitle="Investments" history={history} accountList={investmentAccounts} 
                                totalBalance={investmentAccounts.reduce((cnt, acct) => cnt + acct.current_balance, 0)} />
                        </Grid>
                    }
                </Grid>
            </Container>            
        )
    }
}

const mapStateToProps = state => ({
    bankAccounts: state.accounts.accounts.filter(acct => acct.account_type.includes("CK") || acct.account_type.includes("SV")),
    creditAccounts: state.accounts.accounts.filter(acct => acct.account_type.includes("CR")),
    loanAccounts: state.accounts.accounts.filter(acct => acct.account_type.includes("LN")),
    investmentAccounts: state.accounts.accounts.filter(acct => acct.account_type.includes("IN")),
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
