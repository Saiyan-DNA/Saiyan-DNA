import React from 'react';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import Typography from '@mui/material/Typography';

const WarningIcon = loadable(() => import('@mui/icons-material/Warning' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});

const styles = theme => ({
    loadingMessage: {
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto"
    }
});

const EmptyMessage = ({classes, message}) => {
    return (
        <div className={classes.loadingMessage}>
            <WarningIcon fontSize="large" color="disabled" />
            <Typography variant="body1">Credit Card information not found.</Typography>
        </div>
    )
}

export default withStyles(styles, {withTheme: true})(EmptyMessage);