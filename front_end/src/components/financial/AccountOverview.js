import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';

import TransactionModal from './TransactionModal';

import { setTitle } from '../../actions/navigation';
import { getTransactions } from '../../actions/accounts';
import { getFinancialCategories } from '../../actions/financial_categories';


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
    hideOnPhone: {
        ['@media (max-width: 700px)']: {
            display: "none"
        }
    },
    listCaption: {
        verticalAlign: "text-top", 
        fontStyle: "italic",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
});


class AccountOverview extends React.Component {
    state = {
        actionMenuOpen: false,
        transactionModalOpen: false,
        menuAnchor: null,
        currentTransaction: {}
    };

    componentDidMount() {
        this.props.setTitle("Account Overview");
        this.startDate = new Date("2021-04-01");
        this.endDate = new Date("2021-04-17");
    }

    componentDidUpdate() {
        if (this.props.account.id && !this.state.transactionsLoaded) {
            this.props.getTransactions(this.props.account.id, this.startDate, this.endDate);
            this.state.transactionsLoaded = true;
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        account: PropTypes.object.isRequired,
        accountTransactions: PropTypes.array.isRequired,
        accounts: PropTypes.array.isRequired,
        currentUser: PropTypes.object.isRequired,
        getTransactions: PropTypes.func.isRequired,
    }

    toggleActionMenu = (event) => {
        event.preventDefault();
        this.setState({actionMenuOpen: true, menuAnchor: event.currentTarget});
    }

    closeMenu = () => {
        this.setState({actionMenuOpen: false});
    }

    toggleTransactionModal = (trns) => {
        this.setState({transactionModalOpen: !this.state.transactionModalOpen})

        if (trns) {
            this.setState({currentTransaction: trns});
        } else {
            this.setState({currentTransaction: {}});
        }

        this.closeMenu();
    }

    goToBankingURL(url, e) {
        e.stopPropagation();
        window.open(url,"target=_blank");
    }

    transactionList(styleClasses) {
        if (this.props.accountTransactions.length > 0) {
            return (
                <List>
                    { this.props.accountTransactions.map(trns => (
                        <div key={trns.id}>
                            <ListItem button className={styleClasses.transactionSummary} 
                                onClick={() => this.toggleTransactionModal(trns)}>
                                <Grid container spacing={1} justify="space-between">
                                    <Grid container item spacing={0} xs={12} justify="space-between">
                                        <Grid item xs={8} sm={6}>
                                            <Typography noWrap variant="body1">
                                                {trns.organization ? trns.organization.name : trns.summary}
                                            </Typography>
                                        </Grid>    
                                        <Grid container item sm={4} direction="column" justify="flex-start" className={styleClasses.hideOnPhone}>
                                            <Grid item sm={4}>
                                            {/* Transaction Category */}
                                                {trns.financial_category ? <Chip size="small" color="secondary" label={trns.financial_category.name} /> : <span>&nbsp;</span>}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={4} sm={2} className={styleClasses.numberFormat}>
                                            {/* Transaction Amount */}
                                            <Typography variant="body1">
                                                <NumberFormat value={trns.amount} displayType={'text'}
                                                    thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}
                                                    prefix={
                                                        (this.props.account.account_type == 'CR' || this.props.account.account_type == 'LN') && trns.transaction_type == 'CRD' ? '-$' : 
                                                        (this.props.account.account_type == 'CK' || this.props.account_type == 'SV') && trns.transaction_type == 'DBT' ? '-$' : '$'
                                                        }  />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8} sm={6}>
                                            <div className={styleClasses.listCaption}>
                                                <Typography noWrap variant="caption" className={styleClasses.listCaption}>
                                                    {trns.organization ? trns.summary : trns.description}
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item item xs={4} sm={2} className={styleClasses.numberFormat}>
                                            <Typography variant="caption" className={styleClasses.listCaption}>{trns.transaction_date}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>                                
                            </ListItem>
                        </div>                                
                    ))}
                </List>
            );
        } else {
            return (
                <Typography variant="body1" className={styleClasses.emptyMessage}>No transactions available</Typography>
            )
        }
        
    }

    render() {
        const { classes, account, history } = this.props;
        const { actionMenuOpen, menuAnchor, transactionModalOpen, currentTransaction } = this.state;
        
        return (
            <Container>
                <Grid container spacing={3}>
                    <Grid item container xs={12} justify="space-between">
                        <Button variant="outlined" color="primary" size="small" className={classes.hideForPrint}
                            onClick={history.goBack}>Back</Button>
                        <Button id="actionButton" variant="contained" color="primary" size="small"
                            disabled={account.id ? false : true} className={classes.hideForPrint}
                            aria-controls="actionMenu" aria-haspopup={true}
                            onClick={this.toggleActionMenu.bind(this)}>Actions</Button>
                    </Grid>
                    <Grid item xs={12}>
                        { account.id &&
                        <>
                            <Grid container spacing={2} justify="flex-start">
                                <Grid item>
                                    <Typography variant="caption" className={classes.listCaption} style={{marginLeft: "4px"}}>
                                    {account.organization.website_url != null ?
                                        <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, account.organization.website_url)}>
                                            {account.organization.name}
                                        </Link> :
                                        account.organization.name
                                    }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Card elevation={4} className={classes.listCard}>
                                <CardHeader className={classes.listCardHeader}
                                    title={
                                        <Grid container spacing={3} justify="space-between">
                                            <Grid item xs>
                                                <Typography variant="h6">{account.name}</Typography>
                                            </Grid>
                                            <Grid item xs={"auto"} className={classes.numberFormat}>
                                                <Typography variant="h6">
                                                    <NumberFormat value={account.current_balance} displayType={'text'} 
                                                        thousandSeparator={true} prefix={'$'} decimalScale={2} 
                                                        fixedDecimalScale={true} />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    } />
                                <CardContent className={classes.listCardContent}>
                                    <Grid container spacing={3} justify="flex-end" style={{marginTop: "2px"}}>
                                        <Grid item className={classes.hideForPrint}>
                                            <Button id="addTransactionButton" variant="contained" color="primary" size="small"
                                                aria-controls="addTransactionButton" aria-haspopup={false}
                                                onClick={() => this.toggleTransactionModal(null)}>Add Transaction</Button>
                                        </Grid>
                                    </Grid>
                                    { account.id ? this.transactionList(classes) :
                                        <Typography color="primary" variant="caption">Loading Account Details...</Typography>
                                    }
                                </CardContent>
                            </Card>
                        </>
                        }
                    </Grid>
                </Grid>
                <Menu id="actionMenu" anchorEl={menuAnchor} keepMounted
                    getContentAnchorEl={null} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}                        
                    open={Boolean(actionMenuOpen)} onClose={this.closeMenu}>
                    <MenuItem style={{fontSize: "10pt"}} dense button 
                        onClick={() => this.toggleTransactionModal(null)}
                    >Add Transaction</MenuItem>
                    <MenuItem style={{fontSize: "10pt"}} dense button 
                        onClick={() => console.log("Show Import Transactions Modal")}
                    >Import Transactions</MenuItem>
                    <Divider />                            
                    <MenuItem style={{fontSize: "10pt"}} dense button 
                        onClick={() => history.push("/financial/accountinfo")}
                    >Edit Account</MenuItem>
                </Menu>
                <TransactionModal id="transactionModal" name="transactionModal" 
                    isOpen={transactionModalOpen} transaction={currentTransaction}
                    onClose={this.toggleTransactionModal.bind(this)} />
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    account: state.accounts.currentAccount,
    accountTransactions: state.accounts.accountTransactions,
    accounts: state.accounts.accounts,
    financialCategories: state.accounts.financialCategories
});

export default withRouter(connect(mapStateToProps, { setTitle, getTransactions, getFinancialCategories })(withStyles(styles, {withTheme: true})
    (AccountOverview)));