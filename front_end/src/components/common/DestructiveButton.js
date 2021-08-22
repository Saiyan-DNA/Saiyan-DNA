import React from 'react';
import loadable from '@loadable/component';

import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Navigation" */));

const theme = createMuiTheme({
    typography: {
      fontFamily: "inherit"
    },
    palette: {
        primary: {
            main: "#ba000d",
            contrastText: "#ffffff"            
        },
        secondary: {
            main: "#1769aa",
            contrastText: "#ffffff"
        }
    }
});

const styles = theme => ({
    default: {
        backgroundColor: theme.palette.primary.destructive,
        color: theme.palette.primary.contrastText,
        '&:hover': { 
            backgroundColor: theme.palette.primary.destructiveLight,
        },
    },
});


const DestructiveButton = ({classes, className, children, onClick}) => {
    return (
        <MuiThemeProvider theme={theme}>
            <Button variant="contained" color="primary" size="small" className={className} onClick={onClick}>
                {children}
            </Button>
        </MuiThemeProvider>
    )
}

export default withStyles(styles)(DestructiveButton);