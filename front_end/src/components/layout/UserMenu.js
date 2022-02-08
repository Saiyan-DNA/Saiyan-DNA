import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@mui/material/Typography' /* webpackChunkName: "Material-Layout" */));

const Divider = loadable(() => import('@mui/material/Divider' /* webpackChunkName: "Material" */));
const SwipeableDrawer = loadable(() => import('@mui/material/SwipeableDrawer' /* webpackChunkName: "Material-Navigation" */));
const List = loadable(() => import('@mui/material/List' /* webpackChunkName: "Material-Layout" */));
const ListItem = loadable(() => import('@mui/material/ListItem' /* webpackChunkName: "Material-Layout" */));
const ListItemText = loadable(() => import('@mui/material/ListItemText' /* webpackChunkName: "Material-Layout" */));

const ExitToAppSharp = loadable(() => import('@mui/icons-material/ExitToAppSharp' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});
const HomeSharp = loadable(() => import('@mui/icons-material/HomeSharp' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});
const PersonRounded = loadable(() => import('@mui/icons-material/PersonRounded' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});

const HomeSelectModal = loadable(() => import('../common/HomeSelectModal' /* webpackChunkName: "Navigation" */));

import { userLogout } from '../../actions/auth';
import { setHome, toggleHomeModal } from '../../actions/navigation';
import { toggleUserMenu } from '../../actions/menu';

const styles = (theme) => ({
    sessionInfo: {
        textAlign: "right !important"
    },
    userDrawer: {
        zIndex: "1 !important",
    },
    drawerContainer: {
        maxHeight: "216px",
        Height: "216px"
    },
    drawerContainerTall: {
        maxHeight: "248px",
        Height: "248px"
    },
    userMenu: {
        marginTop: "64px !important"
    },
    userMenuItem: {
        display: "flex !important",
        justifyContent: "flex-end !important",
        textAlign: "right !important"
    },
    userMenuIcon: {
        paddingLeft: "8px !important",
        paddingRight: "0px !important",
    }
});

class UserMenu extends React.Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        userMenuOpen: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
        homeModalOpen: PropTypes.bool.isRequired,
        toggleUserMenu: PropTypes.func.isRequired,
        toggleHomeModal: PropTypes.func.isRequired,
        userLogout: PropTypes.func.isRequired,
        setHome: PropTypes.func.isRequired,
        selectedHome: PropTypes.object,
    }

    componentDidMount() {
        this.homeSelection();
    }

    componentDidUpdate() {
        this.homeSelection();
    }

    homeSelection() {
        const { isAuthenticated, selectedHome, user, setHome, homeModalOpen, toggleHomeModal } = this.props;

        if (isAuthenticated && !selectedHome.id && user.homes && homeModalOpen === false) {
            if (user.homes.length == 1) {
                setHome(user.homes[0]);
                return;
            }
            
            let storedHomeId = localStorage.getItem("homeId");
            let foundHome = user.homes.find(({id}) => id === parseInt(storedHomeId))

            if (foundHome) {
                setHome(foundHome);
                return;
            }

            localStorage.removeItem("homeId");
            
            if (!homeModalOpen) {
                toggleHomeModal();
            }
        }
    }

    doLogout = () => {
        const { toggleUserMenu, userLogout } = this.props;

        toggleUserMenu();
        userLogout();
    }

    showHomeSelectionModal = () => {
        const { toggleUserMenu, toggleHomeModal } = this.props;        
        
        toggleUserMenu();
        toggleHomeModal();
    }

    goEditProfile = () => {
        const { toggleUserMenu } = this.props;

        toggleUserMenu();
        console.log("Edit Profile");
    }

    render() {
        const { classes, toggleUserMenu, userMenuOpen, timeRemaining, user } = this.props;

        let drawerContainerClass = classes.drawerContainer;

        if (user.homes && user.homes.length > 1) {
            drawerContainerClass = classes.drawerContainerTall;
        }

        return (
            <React.Fragment>
                <SwipeableDrawer anchor="right" open={Boolean(userMenuOpen)} onClose={toggleUserMenu} onOpen={toggleUserMenu}
                className={classes.userDrawer} classes={{paper: drawerContainerClass}}>
                    <List component="nav" className={classes.userMenu}>
                        <ListItem className={classes.sessionInfo}>
                            <Grid container spacing={0} direction="column">
                                <Grid item>
                                    <Typography variant="body2">{user.first_name + " " + user.last_name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption">{Math.round(timeRemaining)} Minutes Remaining</Typography>
                                </Grid>
                            </Grid>  
                        </ListItem>
                        <Divider />
                        {user.homes && user.homes.length < 2 ? null : 
                            <ListItem button dense onClick={this.showHomeSelectionModal} className={classes.userMenuItem}>
                                <ListItemText primary="Change Home" /><HomeSharp fontSize="small" className={classes.userMenuIcon}/>
                            </ListItem>
                        }
                        <ListItem button dense onClick={this.goEditProfile} className={classes.userMenuItem}>
                            <ListItemText primary="Edit Profile" /><PersonRounded fontSize="small" className={classes.userMenuIcon} />
                        </ListItem>
                        <ListItem button dense onClick={this.doLogout} className={classes.userMenuItem}>
                            <ListItemText primary="Log Out" /><ExitToAppSharp fontSize="small" className={classes.userMenuIcon} />
                        </ListItem>
                    </List>
                </SwipeableDrawer>
                <HomeSelectModal />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    isLoading: state.auth.isLoading,
    timeRemaining: state.auth.timeRemaining,
    userMenuOpen: state.menu.userMenuOpen,
    homeModalOpen: state.navigation.homeModalOpen,
    selectedHome: state.navigation.selectedHome,
});

const mapDispatchToProps = {
    userLogout,
    toggleUserMenu,
    setHome,
    toggleHomeModal
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(UserMenu)));