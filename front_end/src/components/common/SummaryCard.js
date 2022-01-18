import React from "react";
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material-Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Material-Layout" */));
const CardHeader = loadable(() => import('@material-ui/core/CardHeader' /* webpackChunkName: "Material-Layout" */));

const styles = theme => ({
    summaryCard: {
        backgroundColor: theme.palette.primary.main
    },
    summaryCardHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: "8px !important",
        ['@media print']: {
            backgroundColor: "inherit",
            color: "inherit",
            borderBottom: "0.5px solid #DCDCDC"
        }
    },
    summaryCardContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(0,1,0)
    }
});

class SummaryCard extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        header: PropTypes.any.isRequired,
        children: PropTypes.any.isRequired
    }

    render() {
        const { classes, header, children } = this.props;
        
        return (
            <Card elevation={4} className={classes.summaryCard}>
                <CardHeader className={classes.summaryCardHeader}
                title={header} />
                <CardContent name="summaryCard" className={classes.summaryCardContent}>
                    {children}
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles, {withTheme: true})(SummaryCard);