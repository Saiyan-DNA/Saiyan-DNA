import React from 'react';
import loadable from '@loadable/component';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { withStyles } from '@mui/styles';

const Button = loadable(() => import('@mui/material/Button' /* webpackChunkName: "Material-Navigation" */));

const theme = createTheme({
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
        <ThemeProvider theme={theme}>
            <Button variant="contained" color="primary" size="small" className={className} onClick={onClick}>
                {children}
            </Button>
        </ThemeProvider>
    )
}

export default withStyles(styles)(DestructiveButton);