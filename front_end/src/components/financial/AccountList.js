import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Button, Divider, LinearProgress, Link, List, ListItem, ListItemButton, Grid, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const ArrowUp = loadable(() => import('@mui/icons-material/KeyboardArrowUp' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});
const ArrowDown = loadable(() => import('@mui/icons-material/KeyboardArrowDown' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});

const CurrencyFormat = loadable(() => import('../common/CurrencyFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../common/SummaryCard' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});

import { getAccount } from '../../actions/accounts';

const styles = theme => ({
    accountList: {
        maxHeight: "22em",
        overflowY: "auto",
        '&::-webkit-scrollbar': {
            width: '0.25em',
            margin: '0em 0em 0em 0.5em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(12, 162, 208, 0.5)',
            outline: '0.5px solid slategrey'
        }
    },
    accountSummary: {
        margin: "0em 0.1em 0em 0em",
        padding: "0.5em 0em 0em 0em",
        ['@media print']: {
            paddingTop: "4px",
            paddingBottom: "4px"
        }
    },
    showMore: {
        fontStyle: "italic",
        fontSize: "0.6em"
    },
    inlineGrid: {
        display: "inline-block"
    }
});

class AccountList extends React.Component {
    state = {
        accountsShown: 5
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        getAccount: PropTypes.func.isRequired,
        overviewContent: PropTypes.object,
        accountList: PropTypes.array,
        groupByType: PropTypes.bool,
    }

    goToBankingURL(url, e) {
        e.stopPropagation();
        window.open(url,"target=_blank");
    }

    viewAccount(id) {
        const { history, getAccount, accountLoading } = this.props;
        
        if (!accountLoading) getAccount(id);
        history.push("/financial/accountoverview");
    }

    showMore = () => {
        const { accountList } = this.props;
        const { accountsShown } = this.state;

        var accountsToShow = accountsShown + 5;

        if (accountsToShow >= accountList.length) {    
            accountsToShow = accountList.length;
        }

        this.setState({accountsShown: accountsToShow});
    }

    showLess = () => {
        const { accountsShown } = this.state;

        var accountsToShow = accountsShown - 5;

        if (accountsToShow < 5) accountsToShow = 5;

        this.setState({accountsShown: accountsToShow});
    }

    accountSummary = (acct, classes) => {
        const utilization = acct.current_balance / acct.credit_limit * 100;
        var utilizationColor = utilization > 60 ? "error" : utilization > 30 ? "warning" : utilization > 0 ? "success" : "info";

        return (
            <div key={acct.id}>
                <ListItemButton divider style={{padding: "0px" }} onClick={() => {this.viewAccount(acct.id)}}>
                    <Grid container spacing={0} justifyContent="space-between" className={classes.accountSummary} >
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1">
                                    { acct.name }&nbsp;
                                    { acct.is_closed ? <Typography variant="caption" sx={{fontStyle: "italic"}}>(Closed)</Typography> : null }
                                </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant="body1">
                                    <CurrencyFormat value={acct.current_balance} displayType={'text'} decimalScale={2} />
                                </Typography>
                            </Grid>
                        </Grid>
                        { acct.account_type.value === "CR" && 
                            <Grid item xs={12}>
                                <LinearProgress variant="determinate" value={utilization} color={utilizationColor} />
                            </Grid>
                        }
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
                            <Grid item>
                                <Typography variant="caption" style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                    {acct.organization.website_url != null ?
                                        <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, acct.organization.website_url)}>{acct.organization.name}</Link> :
                                        acct.organization.name
                                    }
                                </Typography>
                            </Grid>
                            { acct.account_type.value === "CR" &&
                                <Grid item xs={"auto"}>
                                    <Typography variant="caption"  style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                        <CurrencyFormat value={acct.credit_limit - acct.current_balance} displayType={'text'} decimalScale={2} />&nbsp;available
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    </Grid>                                
                </ListItemButton>
            </div> 
        );
    }

    render() {
        const { classes, cardTitle, totalBalance, overviewContent, accountList, children, groupByType } = this.props;
        const { accountsShown } = this.state;

        var showMore = accountList && accountsShown < accountList.length ? true : false;
        var showLess = accountList && accountsShown > 5 ? true : false;

        return (
            <SummaryCard headerTitle={cardTitle} headerValue={totalBalance}>
                {overviewContent}
                {accountList &&
                    <List className={classes.accountList}>
                        { accountList.slice(0, accountsShown).map(acct => this.accountSummary(acct, classes)) }
                        { (showMore || showLess) && (
                            <ListItem key="more" disableGutters>
                                <Grid container spacing={0} justifyContent="center">
                                    { showLess && 
                                        <Grid item alignItems="center" onClick={this.showLess}>
                                            <Button color="inherit" fullWidth={true} className={classes.showMore} size="small"
                                                startIcon={<ArrowUp />} endIcon={<ArrowUp />}>Show Less</Button>
                                        </Grid>
                                    }
                                    { (showLess && showMore) && <Grid item xs={"auto"}><Divider orientation="vertical" light={true} /></Grid> }
                                    { showMore &&
                                        <Grid item alignItems="center" onClick={this.showMore}>
                                            <Button color="inherit" fullWidth={true} className={classes.showMore} size="small"
                                                startIcon={<ArrowDown />} endIcon={<ArrowDown />}>Show More</Button>
                                        </Grid>
                                    }
                                </Grid>
                            </ListItem>
                        )}
                    </List>
                }
                {children}
            </SummaryCard>
        );
    }
}

const mapStateToProps = state => ({
    accountLoading: state.accounts.accountLoading,
    accountLoaded: state.accounts.accountLoaded
});

export default connect(mapStateToProps, { getAccount })(withRouter(withStyles(styles, {withTheme: true})(AccountList)));