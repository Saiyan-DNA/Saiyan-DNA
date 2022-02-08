import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from '@mui/styles';

const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@mui/material/Typography' /* webpackChunkName: "Material-Layout" */));

const Link = loadable(() => import('@mui/material/Link' /* webpackChunkName: "Material-Navigation" */));
const List = loadable(() => import('@mui/material/List' /* webpackChunkName: "Material-Layout" */));
const ListItem = loadable(() => import('@mui/material/ListItem' /* webpackChunkName: "Material-Layout" */));

const SummaryCard = loadable(() => import('../common/SummaryCard' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});

import { CurrencyFormat } from '../common/NumberFormats'

import { getAccount } from '../../actions/accounts';

const styles = theme => ({
    accountSummary: {
        margin: 0,
        padding: theme.spacing(1,0,1),
        borderBottom: "0.5px solid #DCDCDC",
        ['@media print']: {
            paddingTop: "4px",
            paddingBottom: "4px"
        }
    },
    inlineGrid: {
        display: "inline-block"
    },
    lowColor: {
        backgroundColor: "#70C1B3",
    },
    mediumColor: {
        backgroundColor: "#FFE066"
    },
    highColor: {
        backgroundColor: "#F25F5C"
    },
});

class AccountList extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getAccount: PropTypes.func.isRequired,
        overviewContent: PropTypes.object,
        accountList: PropTypes.array
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

    accountSummary = (acct, classes) => {
        const utilization = acct.current_balance / acct.credit_limit * 100;
        var utilizationColor = utilization > 60 ? "highColor" : utilization > 30 ? "mediumcolor" : "lowColor";

        return (
            <div key={acct.id}>
                <ListItem button className={classes.accountSummary} 
                    onClick={() => {this.viewAccount(acct.id)}}>
                    <Grid container spacing={0} justifyContent="space-between">
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1">{acct.name}</Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant="body1">
                                    <CurrencyFormat value={acct.current_balance} displayType={'text'} decimalScale={2} />
                                </Typography>
                            </Grid>
                        </Grid>
                        { acct.account_type == "CR" && 
                            <Grid item xs={12}>
                                <LinearProgress variant="determinate" value={utilization} classes={{barColorPrimary: classes[utilizationColor]}} />
                            </Grid>
                        }
                        <Grid container item spacing={0} xs={12} justifyContent="space-between">
                            <Grid item>
                                <Typography variant="caption" style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                    {acct.organization.website_url != null ?
                                        <Link rel="noreferrer" onClick={this.goToBankingURL.bind(this, acct.organization.website_url)}>{acct.organization.name}</Link> :
                                        acct.financial_institution.name
                                    }
                                </Typography>
                            </Grid>
                            { acct.account_type == "CR" &&
                                <Grid item xs={"auto"}>
                                    <Typography variant="caption"  style={{verticalAlign: "text-top", fontStyle: "italic"}}>
                                        <CurrencyFormat value={acct.credit_limit - acct.current_balance} displayType={'text'} decimalScale={2} />&nbsp;available
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    </Grid>                                
                </ListItem>
            </div> 
        );
    }

    render() {
        const { classes, cardTitle, totalBalance, overviewContent, accountList, children } = this.props;

        return (
            <SummaryCard header={
                <Grid container spacing={0} justifyContent={"space-between"}>
                    <Grid item>
                        <Typography variant="h5">{cardTitle}</Typography>
                    </Grid>
                    <Grid item xs={"auto"}>
                        <Typography variant="h5">
                            <CurrencyFormat value={totalBalance} displayType={'text'} decimalScale={2} />
                        </Typography>
                    </Grid>                        
                </Grid>
            }>
                {overviewContent}
                {accountList &&
                    <List>
                        {accountList.map(acct => this.accountSummary(acct, classes))}
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