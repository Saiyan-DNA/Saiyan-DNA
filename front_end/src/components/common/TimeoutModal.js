import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import { Button, Grid, Typography } from '@mui/material';

const BasicModal = loadable(() => import('./BasicModal' /* webpackChunkName: "Common" */));

import { toggleTimeoutModal } from '../../actions/navigation';
import { refreshToken, userLogout } from '../../actions/auth';

const styles = (theme) => ({});

class TimeoutModal extends React.Component {
    static propTypes = {
        timeoutModalOpen: PropTypes.bool.isRequired,
        toggleTimeoutModal: PropTypes.func.isRequired,
        timeRemaining: PropTypes.number.isRequired,
        refreshToken: PropTypes.func.isRequired,
        userLogout: PropTypes.func.isRequired,
    }

    continueSession = () => {
        const { toggleTimeoutModal, refreshToken } = this.props;

        refreshToken();
        toggleTimeoutModal();
    }

    generateMessage = (remaining) => {
        remaining = Math.round(remaining);
        
        switch (remaining) {
            case 0:
                return("Your session will expire in less than one minute.");
            case 1:
                return("Your session will expire in 1 minute.");
            default:
                return("Your session will expire in " + remaining + " minutes.");
        }
    }

    render() {
        const { userLogout, toggleTimeoutModal, timeoutModalOpen, timeRemaining } = this.props;

        return (
            <BasicModal open={timeoutModalOpen} onClose={toggleTimeoutModal} title="Stay Logged In?"> 
                <Grid container spacing={2} justifyContent="space-between">
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            { this.generateMessage(timeRemaining) }
                        </Typography>
                    </Grid>
                    <Grid item container xs={12} justifyContent="flex-end">
                        <Grid item>
                            <Button variant="outlined" size="small" color="primary" onClick={userLogout}>Log Out Now</Button>
                        </Grid>
                        <Grid item>&nbsp;</Grid>
                        <Grid item>
                            <Button variant="contained" size="small" color="primary" onClick={this.continueSession}>Stay Logged In</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </BasicModal>
        )
    }
}

const mapStateToProps = state => ({
    timeoutModalOpen: state.navigation.timeoutModalOpen,
    timeRemaining: state.auth.timeRemaining
});

const mapDispatchToProps = {
    refreshToken,
    userLogout,
    toggleTimeoutModal
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TimeoutModal))