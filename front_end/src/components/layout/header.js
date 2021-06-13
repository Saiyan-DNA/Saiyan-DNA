import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const AppBar = loadable(() => import('@material-ui/core/AppBar' /* webpackChunkName: "Material" */));
const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material" */));
const FormControlLabel = loadable(() => import('@material-ui/core/FormControlLabel' /* webpackChunkName: "Material" */));
const IconButton = loadable(() => import('@material-ui/core/IconButton' /* webpackChunkName: "Material" */));
const Menu = loadable(() => import('@material-ui/core/Menu' /* webpackChunkName: "Material" */));
const MenuItem = loadable(() => import('@material-ui/core/MenuItem' /* webpackChunkName: "Material" */));
const Modal = loadable(() => import('@material-ui/core/Modal' /* webpackChunkName: "Material" */));
const Radio = loadable(() => import('@material-ui/core/Radio' /* webpackChunkName: "Material" */));
const RadioGroup = loadable(() => import('@material-ui/core/RadioGroup' /* webpackChunkName: "Material" */));
const Toolbar = loadable(() => import('@material-ui/core/Toolbar' /* webpackChunkName: "Material" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material" */));

const MenuRounded = loadable(() => import('@material-ui/icons/MenuRounded' /* webpackChunkName: "Icons" */));
const PersonRounded = loadable(() => import('@material-ui/icons/PersonRounded' /* webpackChunkName: "Icons" */));


import { userLogout } from '../../actions/auth';
import { setHome } from '../../actions/navigation';
import { toggleNavMenu } from '../../actions/menu';


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
      modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      modalContent: {
          position: "absolute",
          padding: "8px 12px 8px 12px",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "8pt",
          top: "64px",
          "&:focus": {
              outline: "none",
          },
      },
      radioGroup: {
          border: "0.5px solid rgb(0,0,0,0.2)",
          margin: "2px",
          padding: "8px",
      },
      radioOption: {
          paddingLeft: "6px",
          fontSize: "12pt",
      }
  });

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.doLogout = this.doLogout.bind(this);
        this.classes = null;
    }

    static propTypes = {
        menuOpened: PropTypes.bool.isRequired,
        toggleNavMenu: PropTypes.func.isRequired,
        setHome: PropTypes.func.isRequired,
        headerTitle: PropTypes.string.isRequired,
        currentHome: PropTypes.object.isRequired,
        userHomes: PropTypes.array.isRequired
    }

    state = {
        userMenuOpen: false,
        menuAnchor: null,
        homeModalOpen: false,
        homeModalSelection: this.props.currentHome.id ? this.props.currentHome.id.toString() : "",
    };

    componentDidUpdate() {
        if (this.props.isAuthenticated && !this.props.currentHome.id && this.state.homeModalOpen === false) {
            if (this.props.userHomes.length == 1) {
                this.props.setHome(this.props.userHomes[0]);
                this.setState({homeModalOpen: false});    
                return;
            }

            this.setState({homeModalOpen: true});
        }    
    }

    toggleUserMenu = (event) => {
        if (event) {
            event.preventDefault();
        }

        this.setState({...this.state,
            userMenuOpen: !this.state.userMenuOpen, 
            menuAnchor: (this.state.userMenuOpen ? null : event.currentTarget)
        });
    }

    menuButton() {
        return(
            <IconButton edge="start" className={this.classes.menuButton} color="inherit" 
                onClick={this.props.toggleNavMenu} aria-label="menu">
                <MenuRounded />
            </IconButton>
        );
    }

    homeSubtitle() {
        return(
            <Typography variant="caption" className={this.classes.subTitle} paragraph={false}>{ this.props.currentHome.name}</Typography>
        );
    }

    userButton() {
        return(
            <IconButton edge="end" className={this.classes.profileButton} color="inherit" onClick={this.toggleUserMenu}><PersonRounded /></IconButton>
        );
    }

    selectHomeButton() {
        return(
            <MenuItem style={{fontSize: "10pt"}} dense button 
                onClick={() => this.showHomeSelectionModal()}
                >Change Home</MenuItem>
        );
    }

    doLogout() {
        this.props.userLogout();
        this.toggleUserMenu();
    }

    showHomeSelectionModal = () => {
        this.setState({
            ...this.state, 
            homeModalOpen: true, 
            homeModalSelection: this.props.currentHome.id ? this.props.currentHome.id.toString() : "",
        }, this.toggleUserMenu);
    }

    closeHomeModal = () => {
        this.setState({...this.state, homeModalOpen: false});
    }

    goEditProfile = () => {
        this.toggleUserMenu();
        console.log("Edit Profile");
    }

    selectHomeOption = (event) => {
        this.setState({...this.state, homeModalSelection: event.target.value});
    }

    setCurrentHome = () => {
        this.props.setHome(this.props.userHomes.find( ({ id }) => id === parseInt(this.state.homeModalSelection)));
        this.closeHomeModal();
    }


    modalForm = () => {       
        return(
            <Card className={this.classes.modalContent}>
                <form onSubmit={this.selectHome}>
                    <Typography variant="h6" id="home-modal-title" style={{textAlign: "Center"}}>Select a Home</Typography>
                    <RadioGroup aria-label="home" name="home" value={this.state.homeModalSelection} 
                        className={this.classes.radioGroup} onChange={this.selectHomeOption.bind(this)}>
                        {this.props.userHomes.map(home => {
                            return(
                                <FormControlLabel key={home.id} classes={{label: this.classes.radioOption}} value={home.id.toString()} control={<Radio />} label={home.name} />
                            );
                        })}
                    </RadioGroup>
                    <Button variant="contained" size="small" color="primary" 
                        style={{float: "right", marginTop: "1em", marginLeft: "1em"}} 
                        onClick={this.setCurrentHome}>Select</Button>
                    <Button variant="outlined" size="small" color="primary" 
                        style={{float: "right", marginTop: "1em", marginLeft: "1em"}} 
                        onClick={this.closeHomeModal}>Cancel</Button>
                </form>
            </Card>
        )
    }

    render() {
        const { classes } = this.props;
        this.classes = classes;

        return (
            <>
            <AppBar position="sticky" color="primary" className={this.classes.homeBar} style={{marginBottom: "16px"}}>
                <Toolbar className={this.classes.toolBar}>
                    {this.props.isAuthenticated ? this.menuButton() : null}
                    <Container className={this.classes.headerText}>
                            <Typography variant="h5" className={this.classes.title} paragraph={false}>{this.props.headerTitle}</Typography>
                            {this.props.currentHome ? this.homeSubtitle() : null}
                    </Container>                        
                    {this.props.isAuthenticated ? this.userButton() : null}                        
                </Toolbar>
            </AppBar>
            <Menu id="userMenu" anchorEl={this.state.menuAnchor} keepMounted
                getContentAnchorEl={null} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}                        
                open={Boolean(this.state.userMenuOpen)} onClose={this.toggleUserMenu}>
                {this.props.userHomes.length > 1 ? this.selectHomeButton() : null }
                <MenuItem style={{fontSize: "10pt"}} dense button onClick={this.goEditProfile} id="editProfileOption">
                    Edit Profile
                </MenuItem>
                <MenuItem style={{fontSize: "10pt"}} dense button 
                    onClick={this.doLogout} id="logoutOption">
                    Logout
                </MenuItem>
            </Menu>
            <Modal open={Boolean(this.state.homeModalOpen)} onClose={this.closeHomeModal} 
                disableAutoFocus={true} className={this.classes.modal}>
                {this.modalForm()}
            </Modal>
            </>
        );
    }
}

const mapStateToProps = state => ({
    menuOpened: state.menu.opened,
    isAuthenticated: state.auth.isAuthenticated,
    headerTitle: state.navigation.headerTitle,
    currentHome: state.navigation.currentHome,
    userHomes: state.auth.user.homes || []

});

export default connect(mapStateToProps, { toggleNavMenu, userLogout, setHome })(withStyles(styles, { withTheme: true })(Header))
