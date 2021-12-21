import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';


import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material-Layout" */));

const Link = loadable(() => import('@material-ui/core/Link' /* webpackChunkName: "Material-Navigation" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material-Layout" */));
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material-Layout" */));

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
                                    <CurrencyFormat value={acct.current_balance} displayType={'text'} />
                                </Typography>
                            </Grid>
                        </Grid>
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
                                        <CurrencyFormat value={acct.credit_limit - acct.current_balance} displayType={'text'} />&nbsp;available
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
                            <CurrencyFormat value={totalBalance} displayType={'text'} />
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