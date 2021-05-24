import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import AutoComplete from '@material-ui/lab/AutoComplete'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';

import DestructiveButton from '../common/DestructiveButton';
import BasicModal from '../common/BasicModal';
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
        transferDetailsVisible: false,
        menuAnchor: null,
        currentTransaction: {
            transactionId: null,
            transactionType: "",
            transactionSummary: "",
            transactionDescription: "",
            transactionCategory: null,
            transactionAmount: "",
            transferFromAccount: "",
            transferToAccount: "",
            isValid: false
        }
    };

    componentDidMount() {
        this.props.setTitle("Account Overview");
        this.startDate = new Date("2021-04-01");
        this.endDate = new Date("2021-04-17");

        this.props.getFinancialCategories();
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
        getFinancialCategories: PropTypes.func.isRequired
    }

    validateTransaction = (e, transaction) => {
        var transDetails = (transaction ? transaction: this.state.currentTransaction);
        transDetails.isValid = false;

        if (transDetails.transactionType == "TRN" && transDetails.transactionAmount != "" && transDetails.transferFromAccount != "" && transDetails.transferToAccount != "") {
            transDetails.isValid = true;
        }

        if (["CRD", "DBT"].includes(transDetails.transactionType) && transDetails.transactionAmount != "") {
            transDetails.isValid = true;
        }

        this.setState({currentTransaction: transDetails});
    }

    toggleActionMenu = (event) => {
        event.preventDefault();
        this.setState({actionMenuOpen: true, menuAnchor: event.currentTarget});
    }

    closeMenu = () => {
        this.setState({actionMenuOpen: false});
    }

    toggleTransactionModal = (trans_id) => {
        this.setState({transactionModalOpen: !this.state.transactionModalOpen})

        if (!trans_id) {
            this.setState({currentTransaction: {
                transactionId: null,
                transactionType: "",
                transactionSummary: "", 
                transactionDescription: "",
                transactionCategory: null,
                transactionAmount: "",
                transferFromAccount: "",
                transferToAccount: "",
            }, transferDetailsVisible: false})
        }

        this.closeMenu();
    }

    goToBankingURL(url, e) {
        e.stopPropagation();
        window.open(url,"target=_blank");
    }

    editTransaction = (t) => {
        this.setState({currentTransaction: {
            transactionId: t.id,
            transactionType: t.transaction_type,
            transactionSummary: t.summary, 
            transactionDescription: t.description,
            transactionCategory: t.financial_category,
            transactionAmount: t.amount,
            transferFromAccount: "",
            transferToAccount: "",
        }});

        this.toggleTransactionModal(t.id);
    }

    onChange = (e) => {
        var updatedTransaction = {...this.state.currentTransaction};
        updatedTransaction[e.target.name] = e.target.value;
        this.setState({"currentTransaction": updatedTransaction});
        
        if (updatedTransaction.transactionType == "TRN") {
            this.setState({"transferDetailsVisible": true});
        } else {
            this.setState({"transferDetailsVisible": false});
        }

        // Run Validate without waiting for 'onBlur' event for Select elements
        if (["transactionType", "transferFromAccount", "transferToAccount"].includes(e.target.name)) {
            this.validateTransaction(e, updatedTransaction);
        }
    }

    categorySelected = (option, value) => {
        if (option.id == value.id) {
            return true
        }
        return false;
    }

    saveTransaction = () => {
        console.log(this.state.currentTransaction);
    }

    amountFormat(props) {
        const { inputRef, onChange, ...other } = props;
      
        return (
          <NumberFormat
            {...other}
            getInputRef={inputRef}
            style={{"textAlign": "right"}}
            onValueChange={(values) => {
              onChange({
                target: {
                  name: props.name,
                  value: values.value,
                },
              });
            }}
            onClick={(e) => {
                e.target.select();
            }}
            onBlur={props.onBlur}
            decimalScale={2}
            fixedDecimalScale={true}
            thousandSeparator
            isNumericString
            prefix="$"
          />
        );
      }

    transactionModal(styleClasses) {
        return (
            <BasicModal open={this.state.transactionModalOpen} onClose={this.toggleTransactionModal} title={this.state.currentTransaction.transactionId ? "Edit Transaction" : "Add Transaction"}>
                <Grid container spacing={2} justify="space-between">
                    <Grid item xs={6} sm={6}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionType">Type</InputLabel>
                            <Select id="transactionType" name="transactionType" fullWidth={true} 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={this.state.currentTransaction.transactionType}
                                defaultValue={this.state.currentTransaction.transactionType}>
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value={"CRD"}>Credit</MenuItem>
                                    <MenuItem value={"DBT"}>Debit</MenuItem>
                                    <MenuItem value={"TRN"}>Transfer</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField id="transactionAmount" name="transactionAmount"
                            label="Amount"
                            className="numberFormat"
                            onChange={this.onChange.bind(this)} 
                            onBlur={this.validateTransaction.bind(this)}
                            value={this.state.currentTransaction.transactionAmount}
                            fullWidth={true} InputProps={{inputComponent: this.amountFormat,}}/>                                
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionDescription">Summary</InputLabel>
                            <Input id="transactionSummary" name="transactionSummary" 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={this.state.currentTransaction.transactionSummary} 
                                fullWidth={true} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="transactionDescription">Description</InputLabel>
                            <Input id="transactionDescription" name="transactionDescription" 
                                onChange={this.onChange.bind(this)} 
                                onBlur={this.validateTransaction.bind(this)}
                                value={this.state.currentTransaction.transactionDescription} 
                                fullWidth={true} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <AutoComplete id="transactionCategory" name="transactionCategory"
                            fullWidth={true} 
                            options={this.props.financialCategories ? this.props.financialCategories.sort((a, b) => a.path_name.localeCompare(b.path_name)) : []}
                            getOptionLabel={(option) => option.path_name}
                            getOptionSelected={(option, value) => this.categorySelected(option, value)}
                            value={this.state.currentTransaction.transactionCategory}
                            onChange={(event, value) => this.onChange({target: {name: "transactionCategory", value: value}})}
                            renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}>
                        </AutoComplete>

                    </Grid>
                    { this.state.transferDetailsVisible &&
                        <>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="transferFromAccount">Transfer From</InputLabel>
                                    <Select id="transferFromAccount" name="transferFromAccount"
                                        onChange={this.onChange.bind(this)} 
                                        onBlur={this.validateTransaction.bind(this)}
                                        value={this.state.currentTransaction.transferFromAccount}
                                        fullWidth={true} defaultValue={this.state.currentTransaction.transferFromAccount}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        { this.props.accounts.filter(acct => acct.account_type == "CK" || acct.account_type == "SV").sort((a, b) => a.name > b.name ? 1 : -1).map(acct => (
                                            <MenuItem key={acct.id} value={acct.id}
                                                disabled={acct.id == this.state.currentTransaction.transferToAccount}>
                                                {acct.name}
                                            </MenuItem>    
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel htmlFor="transferToAccount">Transfer From</InputLabel>
                                    <Select id="transferToAccount" name="transferToAccount"
                                        onChange={this.onChange.bind(this)} 
                                        onBlur={this.validateTransaction.bind(this)}
                                        value={this.state.currentTransaction.transferToAccount}
                                        fullWidth={true} defaultValue={this.state.currentTransaction.transferToAccount}>
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            { this.props.accounts.map(acct => (
                                                <MenuItem key={acct.id} value={acct.id}
                                                    disabled={(acct.id == this.state.currentTransaction.transferFromAccount)}>
                                                    {acct.name}
                                                </MenuItem>    
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    }
                    <Grid item xs={12} sm={12}>
                        <Divider />
                    </Grid>
                    <Grid container item xs={12} justify="space-between">
                        <Grid item xs={4}>
                            {this.state.currentTransaction.transactionId ? 
                                <DestructiveButton onClick={() => console.log("Delete Transaction")}>Delete</DestructiveButton> :
                                <Typography>&nbsp;</Typography>
                            }
                        </Grid>                                
                        <Grid container xs={8} item justify="flex-end">
                            <Grid item>
                                <Button color="primary" variant="outlined" onClick={this.toggleTransactionModal.bind(this)}>Cancel</Button>
                            </Grid>
                            <Grid item>&nbsp;</Grid>
                            <Grid item>
                                <Button color="primary" variant="contained" disabled={!this.state.currentTransaction.isValid} onClick={this.saveTransaction.bind(this)}>Save</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </BasicModal>
        );
    }

    transactionList(styleClasses) {
        if (this.props.accountTransactions.length > 0) {
            return (
                <List>
                    { this.props.accountTransactions.map(trns => (
                        <div key={trns.id}>
                            <ListItem button className={styleClasses.transactionSummary} 
                                onClick={() => this.editTransaction(trns)}>
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
        const { classes, account } = this.props;
        
        return (
            <Container>
                <Grid container spacing={3}>
                    <Grid item container xs={12} justify="space-between">
                        <Button variant="outlined" color="primary" size="small" className={classes.hideForPrint}
                            onClick={this.props.history.goBack}>Back</Button>
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
                                        this.props.account.organization.name
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
                <Menu id="actionMenu" anchorEl={this.state.menuAnchor} keepMounted
                    getContentAnchorEl={null} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}                        
                    open={Boolean(this.state.actionMenuOpen)} onClose={this.closeMenu}>
                    <MenuItem style={{fontSize: "10pt"}} dense button 
                        onClick={() => this.toggleTransactionModal(null)}
                    >Add Transaction</MenuItem>
                    <MenuItem style={{fontSize: "10pt"}} dense button 
                        onClick={() => console.log("Show Import Transactions Modal")}
                    >Import Transactions</MenuItem>
                    <Divider />                            
                    <MenuItem style={{fontSize: "10pt"}} dense button 
                        onClick={() => this.props.history.push("/financial/accountinfo")}
                    >Edit Account</MenuItem>
                </Menu>
                { this.transactionModal(classes) }
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