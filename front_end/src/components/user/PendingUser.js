import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Button = loadable(() => import('@mui/material/Button' /* webpackChunkName: "Material-Navigation" */));
const Container = loadable(() => import('@mui/material/Container' /* webpackChunkName: "Material-Layout" */));
const FormControl = loadable(() => import('@mui/material/FormControl' /* webpackChunkName: "Material-Input" */));
const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Material-Layout" */));
const Input = loadable(() => import('@mui/material/Input' /* webpackChunkName: "Material-Input" */));
const InputLabel = loadable(() => import('@mui/material/InputLabel' /* webpackChunkName: "Material-Input" */));
const Typography = loadable(() => import('@mui/material/Typography' /* webpackChunkName: "Material-Layout" */));

const SummaryCard = loadable(() => import('../common/SummaryCard' /* webpackChunkName: "Layout" */));

import { userLogout, verifyUserAccount } from '../../actions/auth';
import { requestVerificationEmail } from '../../actions/email';

const styles = theme => ({
    errorCaption: {
        marginTop: "0em",
        paddingTop: "0em",
        fontStyle: "italic"
    }
});

class PendingUser extends React.Component { 
    state = {
        verificationCode: "",
        formValid: false,
        recommendNewRequest: false
    }   

    static propTypes = {
        userLogout: PropTypes.func.isRequired,
        requestVerificationEmail: PropTypes.func.isRequired,
        verificationError: PropTypes.bool.isRequired,
        user: PropTypes.object
    }
    
    onChange = (e) => {
        if (e.target.value != "") {
            this.setState({verificationCode: e.target.value, formValid: true});
        } else {
            this.setState({verificationCode: e.target.value, formValid: false});
        }
    }

    componentDidUpdate() {
        const { verificationError } = this.props;
        const { recommendNewRequest } = this.state;

        if (verificationError && !recommendNewRequest) {
            this.setState({verificationCode: "", formValid: false, recommendNewRequest: true});
        }
    }

    returnToLogin = () => {
        const { history, userLogout } = this.props;

        userLogout();
        history.push("login");
    }

    verifyCode = (e) => {
        const { verificationCode } = this.state;
        const { verifyUserAccount } = this.props;

        e.preventDefault();
        verifyUserAccount(verificationCode);
    }

    render() {
        const { verificationCode, formValid, recommendNewRequest } = this.state;
        const { user, requestVerificationEmail } = this.props;

        if (user.profile && user.profile.status == "A") {
            return(<Redirect to="/" />);
        }

        return (
            <Container>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item container justifyContent="flex-start">
                        <Button color="primary" variant="outlined" size="small" onClick={this.returnToLogin}>Back</Button>
                    </Grid>
                    <Grid item container xs={12} md={9} justifyContent="flex-end">
                        <SummaryCard header="Awaiting E-Mail Verification">
                            <form onSubmit={this.verifyCode}>
                                <Grid container justifyContent="center" spacing={2} style={{marginTop: "0.1em"}}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            Please enter the verification code sent to your e-mail address when you registered.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} container spacing={2} justifyContent="center" alignItems="flex-end">
                                        <Grid item>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="verificationCode">Verification Code</InputLabel>
                                                <Input type="text" className="form-control"
                                                    id="verificationCode" name="verificationCode"
                                                    inputProps={{autoCapitalize: "none", autoCorrect: "none"}}
                                                    onChange={this.onChange} value={verificationCode}
                                                />
                                            </FormControl>
                                        </Grid>                               
                                        <Grid item>
                                            <Button color="primary" variant="contained" type="submit" size="small"
                                                disabled={!formValid}>Verify Account</Button>
                                        </Grid>
                                        {!recommendNewRequest ? null :
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="error">
                                                    Verification code is expired or invalid. Request a new verification code below.
                                                </Typography>
                                            </Grid>
                                        }
                                    </Grid>
                                    <Grid item>
                                        <Button color="primary" onClick={() => requestVerificationEmail(user.email)}
                                            variant="text" size="small" >Resend Verification E-Mail</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </SummaryCard>
                    </Grid>
                </Grid>                    
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    verificationError: state.auth.verificationError
});

const mapDispatchToProps = {
    userLogout,
    verifyUserAccount,
    requestVerificationEmail
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withRouter(PendingUser)));