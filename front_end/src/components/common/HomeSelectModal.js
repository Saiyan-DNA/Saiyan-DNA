import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const FormControlLabel = loadable(() => import('@material-ui/core/FormControlLabel' /* webpackChunkName: "Material" */));
const Radio = loadable(() => import('@material-ui/core/Radio' /* webpackChunkName: "Material" */));
const RadioGroup = loadable(() => import('@material-ui/core/RadioGroup' /* webpackChunkName: "Material" */));

const BasicModal = loadable(() => import('./BasicModal' /* webpackChunkName: "General" */));

import { setHome, toggleHomeModal } from '../../actions/navigation';

const styles = (theme) => ({
    radioGroup: {
        border: "0.1px solid rgb(0,0,0,0.2)",
        padding: "1em",
    }
});

class HomeSelectmodal extends React.Component {
    state = {
        selectedHome: 0
    }

    static propTypes = {
        currentHome: PropTypes.object.isRequired,
        userHomes: PropTypes.array.isRequired,
        toggleHomeModal: PropTypes.func.isRequired,
        homeModalOpen: PropTypes.bool.isRequired,
        setHome: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { currentHome } = this.props;

        if (currentHome.id) {
            this.setState({selectedHome: currentHome.id});
        }
    }

    selectHomeOption = (event) => {
        this.setState({selectedHome: event.target.value});
    }

    setCurrentHome = () => {
        const { userHomes, setHome, toggleHomeModal } = this.props;
        const { selectedHome } = this.state;

        setHome(userHomes.find( ({ id }) => id === parseInt(selectedHome)));
        toggleHomeModal();
    }

    render() {
        const { userHomes, classes, toggleHomeModal, homeModalOpen } = this.props;
        const { selectedHome } = this.state;

        return (
            <BasicModal open={homeModalOpen} onClose={toggleHomeModal} title="Select a Home"> 
                <Grid container spacing={2} justify="space-between">
                    <Grid item xs={12}>
                    <RadioGroup aria-label="home" name="home" value={selectedHome} defaultValue={selectedHome}
                        className={classes.radioGroup} onChange={this.selectHomeOption}>
                        {userHomes.map(home => {
                            return(
                                <FormControlLabel key={home.id} value={home.id.toString()} label={home.name}
                                    classes={{label: classes.radioOption}} control={<Radio />} checked={home.id == selectedHome} />
                            );
                        })}
                    </RadioGroup>
                    </Grid>
                    <Grid item container xs={12} justify="flex-end">
                        <Grid item>
                            <Button variant="outlined" size="small" color="primary" onClick={toggleHomeModal}>Cancel</Button>
                        </Grid>
                        <Grid item>&nbsp;</Grid>
                        <Grid item>
                            <Button variant="contained" size="small" color="primary" onClick={this.setCurrentHome}>Select</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </BasicModal>
        )
    }
}

const mapStateToProps = state => ({
    currentHome: state.navigation.currentHome,
    userHomes: state.auth.user.homes || [],
    homeModalOpen: state.navigation.homeModalOpen
});

export default connect(mapStateToProps, { setHome, toggleHomeModal })(withStyles(styles, { withTheme: true })(HomeSelectmodal))