import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Material" */));
const Menu = loadable(() => import('@material-ui/core/Menu' /* webpackChunkName: "Navigation" */));
const MenuItem = loadable(() => import('@material-ui/core/MenuItem' /* webpackChunkName: "Navigation" */));

const ExitToAppSharp = loadable(() => import('@material-ui/icons/ExitToAppSharp' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});
const HomeSharp = loadable(() => import('@material-ui/icons/HomeSharp' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});
const PersonRounded = loadable(() => import('@material-ui/icons/PersonRounded' /* webpackChunkName: "Icons" */), {fallback: <span>&nbsp;</span>});

const HomeSelectModal = loadable(() => import('../common/HomeSelectModal' /* webpackChunkName: "Navigation" */));

import { userLogout } from '../../actions/auth';
import { setHome, toggleHomeModal } from '../../actions/navigation';
import { toggleUserMenu } from '../../actions/menu';

const styles = (theme) => ({
    sessionInfo: {
        textAlign: "right !important",
        opacity: "0.7 !important",
        filter: "alpha(opacity=70) !important"
    }
});

class UserMenu extends React.Component {
    state = {
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        userMenuOpen: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
        userHomes: PropTypes.array.isRequired,
        homeModalOpen: PropTypes.bool.isRequired,
        toggleUserMenu: PropTypes.func.isRequired,
        toggleHomeModal: PropTypes.func.isRequired,
        userLogout: PropTypes.func.isRequired,
        setHome: PropTypes.func.isRequired,
        menuAnchor: PropTypes.object,
        currentHome: PropTypes.object,
    }

    componentDidUpdate() {
        const { isAuthenticated, currentHome, userHomes, setHome, homeModalOpen, toggleHomeModal } = this.props;

        if (isAuthenticated && !currentHome.id && homeModalOpen === false) {
            if (userHomes.length == 1) {
                setHome(userHomes[0]);
                return;
            }
            
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
        const { classes, menuAnchor, userMenuOpen, toggleUserMenu, timeRemaining, userHomes, user } = this.props;

        return (
            <React.Fragment>
                <Menu id="userMenu" anchorEl={menuAnchor} keepMounted
                    getContentAnchorEl={null} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}                        
                    open={Boolean(userMenuOpen)} onClose={toggleUserMenu}>
                    <MenuItem className={classes.sessionInfo} disabled >
                        <Grid container spacing={0} direction="column">
                            <Grid item>
                                <Typography variant="body2">{user.first_name + " " + user.last_name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="caption">{Math.round(timeRemaining)} Minutes Remaining</Typography>
                            </Grid>
                        </Grid>                        
                    </MenuItem>
                    <Divider />
                    {userHomes.length < 2 ? null : 
                        <MenuItem dense button onClick={this.showHomeSelectionModal}>
                            <HomeSharp fontSize="small" />&nbsp;&nbsp;Change Home
                        </MenuItem>
                    }
                    <MenuItem dense button onClick={this.goEditProfile} id="editProfileOption">
                        <PersonRounded fontSize="small" />&nbsp;&nbsp;Edit Profile
                    </MenuItem>
                    <MenuItem dense button onClick={this.doLogout} id="logoutOption">
                        <ExitToAppSharp fontSize="small" />&nbsp;&nbsp;Logout
                    </MenuItem>
                </Menu>
                <HomeSelectModal />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userMenuOpen: state.menu.userMenuOpen,
    homeModalOpen: state.navigation.homeModalOpen,
    user: state.auth.user,
    currentHome: state.navigation.currentHome,
    userHomes: state.auth.user.homes || []
});


export default withRouter(connect(mapStateToProps, { userLogout, toggleUserMenu, setHome, toggleHomeModal })(withStyles(styles, { withTheme: true })(UserMenu)));