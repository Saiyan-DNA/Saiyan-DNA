import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const AppBar = loadable(() => import('@mui/material/AppBar' /* webpackChunkName: "Material-Layout" */));
const Container = loadable(() => import('@mui/material/Container' /* webpackChunkName: "Material-Layout" */));
const IconButton = loadable(() => import('@mui/material/IconButton' /* webpackChunkName: "Material-Navigation" */));
const Toolbar = loadable(() => import('@mui/material/Toolbar' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@mui/material/Typography' /* webpackChunkName: "Material-Layout" */));

const MenuRounded = loadable(() => import('@mui/icons-material/MenuRounded' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});
const PersonRounded = loadable(() => import('@mui/icons-material/PersonRounded' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});

import { checkTokenExpiration } from '../../actions/auth';
import { toggleNavMenu, toggleUserMenu } from '../../actions/menu';


const styles = (theme) => ({
    homeBar: {
        ['@media print']: {
            backgroundColor: "#dfdfdf",
            color: "#000000",
        },
    },
    toolBar: {
        justifyContent: "space-between",
        alignItems: "center",
    },
      menuButton: {
        marginRight: theme.spacing(2),
        "&:focus": {
            outline: "none",
            boxShadow: "none",
        },
        ['@media print']: {
            display: "none",
        },
      },
      headerText: {
        flexGrow: 1,
        padding: 0, 
        margin: 0, 
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto",
      },
      title: {
        textAlign: "center",
        verticalAlign: "bottom",
      },
      subTitle: {
          verticalAlign: "top",
          textAlign: "center",
      },
      profileButton: {
        marginLeft: theme.spacing(2),
        "&:focus": {
            outline: "none",
            boxShadow: "none",
        },
        ['@media print']: {
            display: "none",
        }, 
      },
      sessionInfo: {
            textAlign: "right !important",
            opacity: "0.7 !important",
            filter: "alpha(opacity=70) !important"
      }
  });

class Header extends React.Component {
    tokenCheckInterval = null;

    static propTypes = {
        toggleNavMenu: PropTypes.func.isRequired,
        toggleUserMenu: PropTypes.func.isRequired,
        checkTokenExpiration: PropTypes.func.isRequired,
        headerTitle: PropTypes.string.isRequired,
        selectedHome: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        userHomes: PropTypes.array.isRequired,
    }

    toggleUserMenu = (event) => {
        if (event) {
            event.preventDefault();
            this.props.toggleUserMenu(event.currentTarget.id);
        }        
    }

    homeSubtitle() {
        const { classes, selectedHome } = this.props;

        return(
            <Typography variant="caption" className={classes.subTitle} paragraph={false}>{ selectedHome.name}</Typography>
        );
    }

    componentDidMount() {
        const { checkTokenExpiration, isAuthenticated } = this.props;
        if (isAuthenticated) {
            checkTokenExpiration();
        }
    }

    componentDidUpdate() {
        const { checkTokenExpiration, isAuthenticated } = this.props;

        if (isAuthenticated && this.tokenCheckInterval == null) {
            this.tokenCheckInterval = setInterval(checkTokenExpiration, 60000);
        }
    }
    
    componentWillUnmount() {
        clearInterval(this.tokenCheckInterval);
    }

    render() {
        const { classes, isAuthenticated, selectedHome, headerTitle, toggleNavMenu, toggleUserMenu, user } = this.props;
        
        return (
            <React.Fragment>
                <AppBar position="sticky" color="primary" className={classes.homeBar} style={{marginBottom: "16px"}}>
                    <Toolbar className={classes.toolBar}>
                        {!isAuthenticated || (user.profile && user.profile.status != "A") ? null :
                            <IconButton edge="start" className={classes.menuButton} color="inherit" 
                                onClick={toggleNavMenu} aria-label="menu">
                                <MenuRounded />
                            </IconButton>
                        }
                        <Container className={classes.headerText}>
                                <Typography variant="h5" className={classes.title} paragraph={false}>{headerTitle}</Typography>
                                {selectedHome && user.profile && user.profile.status == "A" ? this.homeSubtitle() : null}
                        </Container>                        
                        {!isAuthenticated || (user.profile && user.profile.status != "A") ? null :
                            <IconButton edge="end" className={classes.profileButton} id="userButton" name="userButton" 
                                color="inherit" onClick={toggleUserMenu}><PersonRounded /></IconButton>
                        }                        
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    headerTitle: state.navigation.headerTitle,
    selectedHome: state.navigation.selectedHome,
    user: state.auth.user,
    userHomes: state.auth.user.homes || [],
});

const mapDispatchToProps = {
    toggleNavMenu,
    toggleUserMenu,
    checkTokenExpiration
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Header))