import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Button, Chip, Divider, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const NumberFormat = loadable(() => import('react-number-format' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

const ArrowUp = loadable(() => import('@mui/icons-material/KeyboardArrowUp' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});
const ArrowDown = loadable(() => import('@mui/icons-material/KeyboardArrowDown' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});

const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

import { editTransaction } from '../../actions/transactions';

const styles = theme => ({
    statementSummary: {
        margin: "0em",
        padding: "0.5em 0em 0em 0em",
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
    listCaption: {
        verticalAlign: "text-top", 
        fontStyle: "italic",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    showMore: {
        fontStyle: "italic",
        fontSize: "0.6em"
    }
});

class StatementList extends React.Component {
    state = {
        statementsShown: 10
    }

    static propTypes = {
        account: PropTypes.object.isRequired,
        statementsLoading: PropTypes.bool.isRequired,
        statementsLoaded: PropTypes.bool.isRequired,
        statements: PropTypes.array
    }

    showMore = () => {
        this.setState({statementsShown: this.state.statementsShown + 10});
    }

    showLess = () => {
        let newCount = this.state.statementsShown - 10;
        this.setState({statementsShown: newCount < 10 ? 10 : newCount});
    }

    render() {
        const { account, statements, statementsLoading, statementsLoaded, isMobile, classes } = this.props
        const { statementsShown } = this.state;

        if (statementsLoading) {
            return <LoadingMessage message="Loading Statements" />
        }

        if (!statementsLoading && statementsLoaded && statements && statements.length) {
            var acctType = account.account_type;

            var showMore = statementsShown < transactions.length ? true : false;
            var showLess = statementsShown > 10 ? true : false;

            return (
                <List>
                    { statements.slice(0, statementsShown).map(stmt => (
                        <ListItemButton key={stmt.id} divider onClick={() => this.viewStatement(stmt)} style={{padding: "0px"}}>
                            <Grid container spacing={1} justifyContent="space-between" className={classes.statementSummary} >
                                <Grid container item spacing={0} xs={12} justifyContent="space-between">
                                    <Typography variant="body">{stmt.title}</Typography>
                                </Grid>
                            </Grid>                                
                        </ListItemButton>                           
                    ))}
                    { (showLess || showMore) && (
                        <ListItem disableGutters>
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
            );
            
        }
        return (
            <Typography variant="body1" className={classes.emptyMessage}>No statements available</Typography>
        );
    }
}

const mapStateToProps = state => ({
    account: state.accounts.currentAccount,
    transactionsLoading: state.transactions.transactionsLoading,
    transactionsLoaded: state.transactions.transactionsLoaded,
    transactions: state.transactions.transactions,
    isMobile: state.auth.isMobile
});

const mapDispatchToProps = {
    editTransaction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (StatementList)));