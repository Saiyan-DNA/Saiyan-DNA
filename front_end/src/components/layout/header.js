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

const UserMenu = loadable(() => import('./UserMenu' /* webpackChunkName: "Navigation" */));

import { userLogout, refreshToken } from '../../actions/auth';
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
    static propTypes = {
        navMenuOpen: PropTypes.bool.isRequired,
        userMenuOpen: PropTypes.bool.isRequired,
        toggleNavMenu: PropTypes.func.isRequired,
        toggleUserMenu: PropTypes.func.isRequired,
        headerTitle: PropTypes.string.isRequired,
        currentHome: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        userHomes: PropTypes.array.isRequired,
    }

    state = {
        menuAnchor: null,
        localRemaining: 30
    };

    componentDidUpdate() {
        this.checkTokenExpiration();            
    }

    checkTokenExpiration() {
        const { tokenExpires, refreshToken, userLogout } = this.props;
        const { localRemaining } = this.state;

        const current_time = new Date();        

        if (tokenExpires) {
            // Determine if the token is expired
            let remaining = (tokenExpires - current_time.getTime())/60000;

            console.log("Remaining: " + remaining + " / Local: " + localRemaining);

            if (remaining < 0) {
                console.log("Token expired at: " + new Date(0).setUTCSeconds(tokenExpires))
                userLogout();
                return -1;
            }
    
            // If time remaining is less than 5 minutes, attempt to refresh the token.
            if (remaining < 5) {
                refreshToken();
                return 0;
            }

            let difference = localRemaining - remaining;
            if (difference > 1) {
                this.setState({localRemaining: remaining});
                return 0;
            }

            if (difference < 0) {
                this.setState({localRemaining: 30});
            }
        }
    }

    toggleUserMenu = (event) => {
        if (event) {
            event.preventDefault();
        }

        this.setState({...this.state,
            menuAnchor: (this.state.userMenuOpen ? null : event.currentTarget)
        });

        this.props.toggleUserMenu();
    }

    homeSubtitle() {
        const { classes, currentHome } = this.props;

        return(
            <Typography variant="caption" className={classes.subTitle} paragraph={false}>{ currentHome.name}</Typography>
        );
    }

    render() {
        const { classes, isAuthenticated, currentHome, headerTitle, toggleNavMenu } = this.props;
        const { localRemaining, menuAnchor } = this.state;

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
                            <IconButton edge="end" className={classes.profileButton} color="inherit" onClick={this.toggleUserMenu}><PersonRounded /></IconButton>
                        }                        
                    </Toolbar>
                </AppBar>
                <UserMenu menuAnchor={menuAnchor} timeRemaining={localRemaining} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    navMenuOpen: state.menu.navMenuOpen,
    userMenuOpen: state.menu.userMenuOpen,
    isAuthenticated: state.auth.isAuthenticated,
    headerTitle: state.navigation.headerTitle,
    currentHome: state.navigation.currentHome,
    user: state.auth.user,
    userHomes: state.auth.user.homes || [],
    tokenExpires: state.auth.tokenExpires,
});

export default connect(mapStateToProps, { toggleNavMenu, toggleUserMenu, userLogout, refreshToken, userLogout })(withStyles(styles, { withTheme: true })(Header))