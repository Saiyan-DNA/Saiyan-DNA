import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});

const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "General" */), {fallback: <div>&nbsp;</div>});
const AccountList = loadable(() => import('./AccountList' /* webpackChunkName: "Financial" */), {fallback: <div>&nbsp;</div>})

import { createMessage } from '../../actions/messages';
import { getAccounts, clearAccount, clearTransactions, getInstitutions } from '../../actions/accounts';
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

const AccountTypes = {
    BANKING: 'Banking',
    CREDIT: 'Credit',
    LOAN: 'Loan',
    INVESTMENT: 'Investment'       
}

class FinancialAccounts extends React.Component {
    state = {
        localAccounts: [],
        bankingList: null,
        creditList: null,
        loanList: null,
        investmentList: null
    }

    constructor(props) {
        super(props);
        this.actionAddAccount = this.actionAddAccount.bind(this);
    }   

    static propTypes = {
        accounts: PropTypes.array.isRequired,
        getAccounts: PropTypes.func.isRequired,
        accountsLoading: PropTypes.bool.isRequired,
        accountsLoaded: PropTypes.bool.isRequired,
        getInstitutions: PropTypes.func.isRequired,
        clearAccount: PropTypes.func.isRequired,
        clearTransactions: PropTypes.func.isRequired,
        createMessage: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired
    }

    generateView = () => {
        const { accounts, accountsLoading, accountsLoaded, getAccounts, history } = this.props;
        const { localAccounts } = this.state;

        var banking, credit, loans, investments = null;

        if (!accountsLoaded && !accountsLoading) {
            getAccounts();
        }

        if (localAccounts.length != accounts.length && !accountsLoading && accountsLoaded) {
            banking = <AccountList accountType={AccountTypes.BANKING} cardTitle="Banking" history={history} />;
            credit = <AccountList accountType={AccountTypes.CREDIT} cardTitle="Credit Cards" history={history} />;
            loans = <AccountList accountType={AccountTypes.LOAN} cardTitle="Loans" history={history} />;
            investments = <AccountList accountType={AccountTypes.INVESTMENT} cardTitle="Investments" history={history} />;
            this.setState({localAccounts: accounts, bankingList: banking, creditList: credit, loanList: loans, investmentList: investments});
        }
    }

    componentDidMount() {
        const { clearAccount, getInstitutions, clearTransactions, setTitle } = this.props;
        
        setTitle("Accounts");
        clearAccount();
        getInstitutions();
        clearTransactions();

        this.generateView();

    }

    componentDidUpdate() {       
        this.generateView();
    }

    actionAddAccount() {
        this.props.clearAccount();
        this.props.history.push("/financial/accountinfo");
    }

    render() {
        const { classes, accountsLoading, accountsLoaded } = this.props;
        const {bankingList, creditList, loanList, investmentList } = this.state;

        if (!accountsLoaded && (accountsLoading || !bankingList || !creditList || !loanList || !investmentList)) {
            return <LoadingMessage message="Loading Accounts..." />
        }

        return (
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} align={"right"} mt={2} className={classes.hideForPrint}>
                        <Button variant={"contained"} color={"primary"} size="small" 
                            onClick={this.actionAddAccount}>Add Account</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.inlineGrid}>{bankingList}</Grid>
                    <Grid item xs={12} sm={6} className={classes.inlineGrid}>{creditList}</Grid>
                    <Grid item xs={12} sm={6} className={classes.inlineGrid}>{loanList}</Grid>
                    <Grid item xs={12} sm={6} className={classes.inlineGrid}>{investmentList}</Grid>
                </Grid>
            </Container>            
        )
    }
}

const mapStateToProps = state => ({
    accounts: state.accounts.accounts,
    accountsLoading: state.accounts.accountsLoading,
    accountsLoaded: state.accounts.accountsLoaded,
    message: state.message
});

export default connect(mapStateToProps, { getAccounts, clearAccount, clearTransactions, getInstitutions, createMessage, setTitle })(withStyles(styles, { withTheme: true })(FinancialAccounts));
