import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Grid, LinearProgress, List, ListItemButton, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const EmptyMessage = loadable(() => import('../../common/EmptyMessage' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const LoadingMessage = loadable(() => import('../../common/LoadingMessage' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

import { getCreditReports } from "../../../actions/creditReports";

const styles = theme => ({
    numberFormat: {
        textAlign: "right"
    },
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    },
    caption: {
        verticalAlign: "text-top",
        fontStyle: "italic",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
});

class CreditScorePanel extends React.Component {
    state = {
        latestReports: null,
        agencies: ["Equifax", "Experian", "TransUnion"],
        ratings: [
            {minScore: 0, maxScore: 579, label: "Poor"},
            {minScore: 580, maxScore: 669, label: "Fair"},
            {minScore: 670, maxScore: 739, label: "Good"},
            {minScore: 740, maxScore: 799, label: "Very Good"},
            {minScore: 800, maxScore: 850, label: "Exceptional"}
        ],
    };

    static propTypes = {
        classes: PropTypes.object.isRequired,
        getCreditReports: PropTypes.func.isRequired,
        creditReports: PropTypes.array.isRequired,
        creditReportsLoading: PropTypes.bool.isRequired,
        creditReportsLoaded: PropTypes.bool.isRequired,
        creditReportsLoadError: PropTypes.bool.isRequired,        
    }

    componentDidMount() {
        const { getCreditReports, creditReportsLoading, creditReportsLoaded } = this.props;

        if (!creditReportsLoading && !creditReportsLoaded) getCreditReports();
        if (creditReportsLoaded) this.getLatestReports();        
    }

    componentDidUpdate() {
        const { creditReportsLoaded } = this.props;
        const { latestReports } = this.state;

        if (creditReportsLoaded && !latestReports) this.getLatestReports();
    }

    getLatestReports = () => {
        const { creditReports } = this.props;
        const { agencies, ratings } = this.state;

        var orderedReports = creditReports.sort((a, b) => {a.date < b.date ? 1 : -1});
        var latestReports = [];

        agencies.forEach(agency => {
            let report = orderedReports.find(report => report.agency.name === agency);
            
            if (report) {
                let rating = ratings.find(rating => report.credit_score <= rating.maxScore);
                latestReports.push({agency: agency, score: report.credit_score, lastUpdated: report.date, rating: rating.label});
            }
        })

        this.setState({latestReports: latestReports});
    }

    scoreSummary = (summary, index, classes) => {
        const { ratings } = this.state;

        return (
            <ListItemButton key={index} divider disableGutters dense>
                <Grid container spacing={2}>
                    <Grid item container xs direction="column">
                        <Grid item><Typography variant="body1">{summary.agency}</Typography></Grid>
                        <Grid item><Typography variant="caption" className={classes.caption}>Updated: {summary.lastUpdated}</Typography></Grid>
                    </Grid>
                    <Grid item xs={"auto"}><Typography variant="h4" className={classes.numberFormat}>{summary.score}</Typography></Grid>
                    <Grid item container spacing={0.25} xs={12} style={{paddingTop: "0px", paddingBottom: "0px", marginTop: "0px", marginBottom: "0px"}}>
                        {ratings.map((rating, index) => {
                            let percentage = (summary.score - rating.minScore) / (rating.maxScore - rating.minScore) * 100;

                            return (
                                <Grid item xs={2.4} key={rating.label}>
                                    <LinearProgress variant="determinate" style={{height: "0.5em"}} value={percentage < 100 ? percentage : 100} 
                                        color={percentage >= 100 ? "success" : "warning"} />
                                </Grid>
                            )
                        })}
                        { summary.score >= 580 && (
                            <Grid item xs={summary.score <= 669 ? 2.4 : summary.score <= 739 ? 4.8 : summary.score <= 799 ? 7.2 : 8.6}>
                                &nbsp;
                            </Grid>
                        )}
                        <Grid item>
                            <Typography variant="caption" className={classes.caption}>{summary.rating}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemButton>
        )
    }

    render() {
        const { classes, creditReports, creditReportsLoading, creditReportsLoaded, creditReportsLoadError, ...otherProps } = this.props;
        const { latestReports } = this.state;

        return (
            <SummaryCard headerTitle="Credit Score">
                <Grid container spacing={2} justifyContent={"space-between"}>
                    { creditReportsLoading && !creditReportsLoaded && 
                        <Grid item xs={12} alignContent="center">
                            <LoadingMessage message="Getting Credit Reports..." /> 
                        </Grid>
                    }
                    { creditReportsLoaded && latestReports && latestReports.length > 0 &&
                        <Grid item xs={12}>
                            <List>
                                {latestReports.map((summary, index) => this.scoreSummary(summary, index, classes))}
                            </List>
                        </Grid>
                    }
                    { creditReportsLoaded && latestReports && !(latestReports.length > 0) && 
                        <Grid item xs={12}>
                            <EmptyMessage message="Credit Score information not found." />
                        </Grid>
                    }
                </Grid>
            </SummaryCard>
        );
    }
}

const mapStateToProps = state => ({
    creditReports: state.creditReports.creditReports,
    creditReportsLoading: state.creditReports.creditReportsLoading,
    creditReportsLoaded: state.creditReports.creditReportsLoaded,
    creditReportsLoadError: state.creditReports.creditReportsLoadError,
});

const mapDispatchToProps = {
    getCreditReports
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (CreditScorePanel));