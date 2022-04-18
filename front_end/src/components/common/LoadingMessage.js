import React from 'react';

import { withStyles } from '@mui/styles';

import { CircularProgress, Typography } from '@mui/material';

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