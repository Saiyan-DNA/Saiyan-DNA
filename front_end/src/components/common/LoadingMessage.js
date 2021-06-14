import React from 'react';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const CircularProgress = loadable(() => import('@material-ui/core/CircularProgress' /* webpackChunkName: "Material" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material" */));

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