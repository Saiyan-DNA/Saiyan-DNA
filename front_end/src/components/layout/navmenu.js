import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Collapse = loadable(() => import('@material-ui/core/Collapse' /* webpackChunkName: "Material" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material" */));
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material" */));
const ListItemText = loadable(() => import('@material-ui/core/ListItemText' /* webpackChunkName: "Material" */));
const Menu = loadable(() => import('@material-ui/core/Menu' /* webpackChunkName: "Material" */));
const MenuItem = loadable(() => import('@material-ui/core/MenuItem' /* webpackChunkName: "Material" */));
const SwipeableDrawer = loadable(() => import('@material-ui/core/SwipeableDrawer' /* webpackChunkName: "Material" */));

const ExpandLess = loadable(() => import('@material-ui/icons/ExpandLess' /* webpackChunkName: "Icons" */));
const ExpandMore = loadable(() => import('@material-ui/icons/ExpandMore' /* webpackChunkName: "Icons" */));

import { toggleNavMenu } from '../../actions/menu';
import { userNav } from '../../actions/navigation';
import { userHasPermission } from '../../actions/auth';

const styles = (theme) => ({
    menuItem: {
        flex: 1,
        width: '100%',
        minWidth: 200,
        maxWidth: 360,
        borderBottom: "1px solid rgb(0,0,0,0.2)",
        justifyContent: "space-between",
        /*"&.Mui-selected": {
            backgroundColor: "rgb(0,0,0,0.6)",
            color: "rgb(255,255,255,1)"
          }*/
    },
    navList: {
        width: '100%',
        maxWidth: '360',
    },
    subMenu: {
        padding: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        borderBottom: "1px solid rgb(0,0,0,0.2)",
    },
    subMenuItem: {
        fontSize: "11pt",
        padding: "auto 20px",
        paddingLeft: "2em",
    },
});

class NavMenu extends React.Component {
    constructor(props) {
        super(props);
        this.activeRoute = this.activeRoute.bind(this);
        this.classes = null;
    }

    static propTypes = {
        menuOpened: PropTypes.bool.isRequired,
        toggleNavMenu: PropTypes.func.isRequired,
        userNav: PropTypes.func.isRequired,
        userHasPermission: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    state = {
        manageInventoryMenuOpen: false,
        manageInventoryMenuAnchor: null,
        manageGroupOpen: false,
        inventoryGroupOpen: false,
        financialGroupOpen: false
    }

    navigateTo(url, e) {
        this.closeManageInventoryMenu();
        this.props.toggleNavMenu();
        this.props.history.push(url);
        this.props.userNav(url);
    }

    activeRoute = (routePath) => {
        return this.props.location.pathname === routePath ? true : false;
    }

    guestMenuOptions() {
        return (
            <List>
                <ListItem button 
                    onClick={this.navigateTo.bind(this, "/login")}
                    selected={this.activeRoute("/login")}>
                    <ListItemText>Log In</ListItemText>
                </ListItem>
                <ListItem button 
                    onClick={this.navigateTo.bind(this, "/register")}
                    selected={this.activeRoute("/register")}>
                    <ListItemText>Register</ListItemText>
                </ListItem>
            </List>
        );
    }

    showManageInventoryMenu = (event) => {
        this.setState({...this.state,
            manageInventoryMenuOpen: true,
            manageInventoryMenuAnchor: event.target,
        });
    }

    closeManageInventoryMenu = () => {
        this.setState({...this.state,
            manageInventoryMenuOpen: false,
            manageInventoryMenuAnchor: null,
        }); 
    }

    toggleFinancialGroup = (event) => {
        this.setState({
            ...this.state,
            financialGroupOpen: !this.state.financialGroupOpen,
            inventoryGroupOpen: false,
            manageGroupOpen: false
        }); 
    }

    toggleInventoryGroup = (event) => {
        this.setState({
            ...this.state,
            inventoryGroupOpen: !this.state.inventoryGroupOpen,
            financialGroupOpen: false,
            manageGroupOpen: false
        }); 
    }

    toggleManageGroup = (event) => {
        this.setState({
            ...this.state,
            manageGroupOpen: !this.state.manageGroupOpen,
            inventoryGroupOpen: false,
            financialGroupOpen: false
        }); 
    }

    userMenuOptions() {
        return (
            <List component="nav" className={this.classes.navList}>
                <ListItem button className={this.classes.menuItem}
                    onClick={this.navigateTo.bind(this, "/")}
                    selected = {this.activeRoute("/")}>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button className={this.classes.menuItem}
                    onClick={this.toggleFinancialGroup}
                    selected={this.state.financialGroupOpen}>
                    <ListItemText primary="Financials" />
                    {Boolean(this.state.financialGroupOpen) ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.financialGroupOpen} unmountOnExit>
                    <List className={this.classes.subMenu} dense>
                        <ListItem button dense className={this.classes.subMenuItem}
                            onClick={this.navigateTo.bind(this, "/financial")}
                            selected = {this.activeRoute("/financial")}>
                                Overview
                        </ListItem>
                        {this.props.userHasPermission("view_account") && 
                            <ListItem button dense className={this.classes.subMenuItem}
                                onClick={this.navigateTo.bind(this, "/financial/accounts")}
                                selected = {this.activeRoute("/financial/accounts")}>
                                    Accounts
                            </ListItem>
                        }
                        {this.props.userHasPermission("view_asset") &&
                            <ListItem button dense className={this.classes.subMenuItem}
                                onClick={this.navigateTo.bind(this, "/financial/assets")}
                                selected = {this.activeRoute("/financial/assets")}>
                                    Assets
                            </ListItem>
                        }
                        <ListItem button dense className={this.classes.subMenuItem}>Budgets</ListItem>
                    </List>
                </Collapse>
                {this.props.userHasPermission("inventory") &&
                    <>
                        <ListItem button className={this.classes.menuItem}
                            onClick={this.toggleInventoryGroup}
                            selected={this.state.inventoryGroupOpen}>
                            <ListItemText primary="Inventory" />
                            {Boolean(this.state.inventoryGroupOpen) ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.inventoryGroupOpen} unmountOnExit>
                            <List className={this.classes.subMenu} dense>
                                <ListItem button dense className={this.classes.subMenuItem}>Overview</ListItem>
                                <ListItem button dense className={this.classes.subMenuItem}>Count</ListItem>
                                <ListItem button dense className={this.classes.subMenuItem}>Receive</ListItem>
                                <ListItem button dense className={this.classes.subMenuItem}>Use</ListItem>
                            </List>
                        </Collapse>
                    </>
                }
                <ListItem button className={this.classes.menuItem}
                    onClick={this.toggleManageGroup}
                    selected={this.state.manageGroupOpen}>
                    <ListItemText primary="Manage" />
                    {Boolean(this.state.manageGroupOpen) ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.manageGroupOpen} unmountOnExit>
                    <List className={this.classes.subMenu} dense>
                        <ListItem button dense className={this.classes.subMenuItem}
                            onClick={this.navigateTo.bind(this, "/manage/homes")}
                            selected = {this.activeRoute("/manage/homes")}>
                                Homes
                        </ListItem>
                        {this.props.userHasPermission("inventory") &&
                            <ListItem button dense onClick={this.showManageInventoryMenu} className={this.classes.subMenuItem}>Inventory</ListItem>
                        }
                        {this.props.userHasPermission("people") && 
                            <ListItem button dense className={this.classes.subMenuItem}
                                onClick={this.navigateTo.bind(this, "/manage/people")} 
                                selected={this.activeRoute("/manage/people")}>
                                    People
                            </ListItem>
                        }
                    </List>
                </Collapse>

            </List>
        );
    }

    render() {
        const { classes } = this.props;
        this.classes = classes;

        return(
            <>
                <SwipeableDrawer anchor={"left"} open={this.props.menuOpened} style={{zIndex: "1"}} onClose={this.props.toggleNavMenu} onOpen={this.props.toggleNavMenu}>
                    <div style={{height: "54px"}}>&nbsp;</div>
                    { this.props.isAuthenticated ? this.userMenuOptions() : this.guestMenuOptions() }
                </SwipeableDrawer>
                <Menu open={Boolean(this.state.manageInventoryMenuOpen)} anchorEl={this.state.manageInventoryMenuAnchor} anchorOrigin={{ vertical: "top", horizontal: "right" }} 
                    onClose={this.closeManageInventoryMenu}>
                    <MenuItem button dense onClick={this.navigateTo.bind(this, "/inventory/categories")}>Categories</MenuItem>
                    <MenuItem button dense onClick={this.navigateTo.bind(this, "/")}>Items</MenuItem>
                    <MenuItem button dense onClick={this.navigateTo.bind(this, "/")}>Recipes</MenuItem>
                    <MenuItem button dense onClick={this.navigateTo.bind(this, "/")}>Suppliers</MenuItem>
                </Menu>
            </>
        );
    }

}

const mapStateToProps = state => ({
    menuOpened: state.menu.opened,
    isAuthenticated: state.auth.isAuthenticated
});


export default withRouter(connect(mapStateToProps, { toggleNavMenu, userNav, userHasPermission })(withStyles(styles, { withTheme: true })(NavMenu)));