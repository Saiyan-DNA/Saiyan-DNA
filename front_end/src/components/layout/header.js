import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const AppBar = loadable(() => import('@material-ui/core/AppBar' /* webpackChunkName: "Layout" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Layout" */));
const IconButton = loadable(() => import('@material-ui/core/IconButton' /* webpackChunkName: "Layout" */));
const Toolbar = loadable(() => import('@material-ui/core/Toolbar' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

const MenuRounded = loadable(() => import('@material-ui/icons/MenuRounded' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});
const PersonRounded = loadable(() => import('@material-ui/icons/PersonRounded' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});

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
        currentHome: PropTypes.object.isRequired,
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
        const { classes, currentHome } = this.props;

        return(
            <Typography variant="caption" className={classes.subTitle} paragraph={false}>{ currentHome.name}</Typography>
        );
    }

    componentDidMount() {
        const { checkTokenExpiration, isAuthenticated } = this.props;
        if (isAuthenticated) {
            checkTokenExpiration()            
            this.tokenCheckInterval = setInterval(checkTokenExpiration, 60000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.tokenCheckInterval);
    }

    render() {
        const { classes, isAuthenticated, currentHome, headerTitle, toggleNavMenu, toggleUserMenu } = this.props;

        return (
            <React.Fragment>
                <AppBar position="sticky" color="primary" className={classes.homeBar} style={{marginBottom: "16px"}}>
                    <Toolbar className={classes.toolBar}>
                        {!isAuthenticated ? null :
                            <IconButton edge="start" className={classes.menuButton} color="inherit" 
                                onClick={toggleNavMenu} aria-label="menu">
                                <MenuRounded />
                            </IconButton>
                        }
                        <Container className={classes.headerText}>
                                <Typography variant="h5" className={classes.title} paragraph={false}>{headerTitle}</Typography>
                                {currentHome ? this.homeSubtitle() : null}
                        </Container>                        
                        {!isAuthenticated ? null :
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
    currentHome: state.navigation.currentHome,
    user: state.auth.user,
    userHomes: state.auth.user.homes || [],
});

const mapDispatchToProps = {
    toggleNavMenu,
    toggleUserMenu,
    checkTokenExpiration
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Header))