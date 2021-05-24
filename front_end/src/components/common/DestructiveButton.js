import React from 'react';

import Button from '@material-ui/core/Button'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';

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


const DestructiveButton = ({classes, children, onClick}) => {
    return (
        <MuiThemeProvider theme={theme}>
            <Button variant="contained" color="primary" onClick={onClick}>
                {children}
            </Button>
        </MuiThemeProvider>
    )
}

export default withStyles(styles)(DestructiveButton);