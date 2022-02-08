import React from 'react';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const CircularProgress = loadable(() => import('@mui/material/CircularProgress' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@mui/material/Typography' /* webpackChunkName: "Material-Layout" */));

const styles = theme => ({
    loadingMessage: {
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto"
    }
});

const LoadingMessage = ({classes, message}) => {
    return (
        <div className={classes.loadingMessage}>
            <Typography variant="body1">{message}</Typography><br />
            <CircularProgress variant="indeterminate" color="primary" />
        </div>
    )
}

export default withStyles(styles, {withTheme: true})(LoadingMessage);