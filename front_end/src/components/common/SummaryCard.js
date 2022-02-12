import React from "react";
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';

const CurrencyFormat = loadable(() => import('../common/NumberFormats' /* webpackChunkName: "Financial" */).then(m => m.CurrencyFormat));

const styles = theme => ({
    summaryCard: {
        backgroundColor: theme.palette.primary.main,
        height: "100%"
    },
    summaryCardHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        minHeight: "2em !important",
        maxHeight: "2em !important",
        height: "2em !important",
        padding: "0.25em !important",
        ['@media print']: {
            backgroundColor: "inherit",
            color: "inherit",
            borderBottom: "0.5px solid #DCDCDC"
        }
    },
    summaryCardContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(0,1,0)
    },
    headerValue: {
        textAlign: "right"
    },
});

class SummaryCard extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        headerTitle: PropTypes.string.isRequired,
        headerValue: PropTypes.number,
        valueScale: PropTypes.number,
        children: PropTypes.any.isRequired,
    }

    render() {
        const { classes, headerTitle, headerValue, valueScale, children } = this.props;
        
        return (
            <Card elevation={4} className={classes.summaryCard}>
                <CardHeader className={classes.summaryCardHeader}
                title={
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs>
                            <Typography variant="h6">{headerTitle}</Typography>
                        </Grid>
                        { headerValue &&
                            <Grid item xs={"auto"} className={classes.headerValue}>
                                <Typography variant="h6">
                                    <CurrencyFormat value={headerValue} displayType={'text'}
                                        decimalScale={valueScale === null || valueScale === "" || valueScale === undefined ? 2 : valueScale} />
                                </Typography>
                            </Grid>
                        }
                    </Grid>
                } />
                <CardContent name="summaryCard" className={classes.summaryCardContent}>
                    {children}
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles, {withTheme: true})(SummaryCard);