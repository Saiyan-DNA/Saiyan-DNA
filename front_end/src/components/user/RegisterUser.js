import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import zxcvbn from 'zxcvbn';

import { Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const PasswordStrengthMeter = loadable(() => import('./PasswordStrengthMeter' /*webpackChunkName: "Common" */));

import { setTitle } from '../../actions/navigation';
import { registerUser, clearRegistrationErrors } from '../../actions/auth';
import { requestUsernameEmail } from '../../actions/email';

const styles = theme => ({
    linkText: {
        color: "blue",
        textDecoration: "underline",
        cursor: "pointer"
    }
});

class RegisterUser extends React.Component {
    state = {
        userInfo: {
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            password: "",
            password2: "",
        },
        formValid: false,
        passwordMismatchMessageVisible: false,
        usernameInUseMessageVisible: false,
        emailInUseMessageVisible: false,
        submittedUsername: "",
        submittedEmail: "",
    }

    static propTypes = {
        registrationErrors: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        setTitle: PropTypes.func.isRequired,
        registerUser: PropTypes.func.isRequired,
        clearRegistrationErrors: PropTypes.func.isRequired,
        requestUsernameEmail: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setTitle("Register");
    }

    componentDidUpdate() {
        var registrationErrors = this.props.registrationErrors;

        if (registrationErrors.username && !this.state.usernameInUseMessageVisible) {
            this.toggleMessage("username", true);
        }
        if (!registrationErrors.username && this.state.usernameInUseMessageVisible) {
            this.toggleMessage("username", false);
        }

        if (registrationErrors.email && !this.state.emailInUseMessageVisible)  {
            this.toggleMessage("email", true);
        }
        if (!registrationErrors.email && this.state.emailInUseMessageVisible) {
            this.toggleMessage("email", false);
        }
    }

    onSubmit = e => {
        e.preventDefault();
        console.log('submit')
    }

    onChange = (e) => {
        var updatedInfo = this.state.userInfo;
        updatedInfo[e.target.name] = e.target.value;

        this.setState({userInfo: updatedInfo, formValid: this.validateForm(updatedInfo)});
    }

    validateForm = (userInfo) => {
        var isValid = true;
        if (userInfo.firstName == "") isValid = false;
        if (userInfo.lastName == "") isValid = false;
        if (userInfo.email == "") isValid =  false;
        if (userInfo.userName == "") isValid = false;

        // Password Validation - Must fill in Password and Password2 (Confirm Password)
        if (userInfo.password == "" || userInfo.password2 == "") isValid = false;

        // Password Validation - Validate Passwords match
        if (userInfo.password && userInfo.password2 && userInfo.password != userInfo.password2) {
            this.toggleMessage("password", true);
            isValid = false;
        } else {
            this.toggleMessage("password", false);
        }

        // Clear Registration Errors if user has modified username
        if (userInfo.userName != this.state.submittedUsername && this.state.usernameInUseMessageVisible) {
            this.props.clearRegistrationErrors();
        }

        // Clear Registration Errors if user has modified email
        if (userInfo.email != this.state.submittedEmail && this.state.emailInUseMessageVisible) {
            this.props.clearRegistrationErrors();
        }
        
        // Password Validation - Validate Password Strength (using zxcvbn)
        if (zxcvbn(userInfo.password).score < 3) {
            isValid = false;
        }

        return isValid;
    }

    toggleMessage = (message, isVisible) => {
        switch (message) {
            case "password": {
                this.setState({passwordMismatchMessageVisible: isVisible});
                break;
            }
            case "username": {
                this.setState({usernameInUseMessageVisible: isVisible});
                break;
            }
            case "email": {
                this.setState({emailInUseMessageVisible: isVisible});
                break;
            }
            default: {
                break;
            }
        }

        if (isVisible) this.setState({isValid: false});
        
    }

    registerUser = (e) => {
        e.preventDefault();

        const userInfo = this.state.userInfo;

        this.setState({submittedUsername: userInfo.userName, submittedEmail: userInfo.email})
        this.props.registerUser({
            "first_name": userInfo.firstName,
            "last_name": userInfo.lastName,
            "email": userInfo.email,
            "username": userInfo.userName,
            "password": userInfo.password
        });
    }

    render() {
        const { userInfo, formValid, passwordMismatchMessageVisible, usernameInUseMessageVisible, emailInUseMessageVisible } = this.state;
        const { classes, isAuthenticated, requestUsernameEmail } = this.props;

        if (isAuthenticated) {
            return <Redirect to="/" />;
        }

        return (
            <Container>
                <Grid container spacing={0} justifyContent="center">
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <Card elevation={4}>
                            <CardContent>
                                <form onSubmit={this.registerUser}>
                                    <Grid container spacing={2} justifyContent="space-between">
                                        <Grid item container xs={12} sm={12} justifyContent="center">
                                            <Typography variant="h5">Register a New Account</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField type="text" className="form-control" id="firstName" name="firstName" variant="standard"
                                                inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "off"}}
                                                value={userInfo.firstName} onChange={this.onChange} label="First Name" fullWidth required />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField type="text" className="form-control" id="lastName" name="lastName" variant="standard"
                                                inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "off"}}
                                                value={userInfo.lastName} onChange={this.onChange} label="Last Name" fullWidth required />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField type="email" className="form-control" id="email" name="email" variant="standard"
                                                inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "off"}}
                                                value={userInfo.email} onChange={this.onChange} label="E-Mail Address" fullWidth required
                                                error={emailInUseMessageVisible} />
                                            { emailInUseMessageVisible &&
                                                <Typography variant="caption" color="error">
                                                    This e-mail is already in use. Click <a href="#" className={classes.linkText} onClick={() => {requestUsernameEmail(userInfo.email)}}>here</a> to retrieve your username.
                                                </Typography>
                                            }    
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField type="text" className="form-control" id="userName" name="userName" variant="standard"
                                                inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "new-username"}}
                                                value={userInfo.userName} onChange={this.onChange} label="Username" fullWidth required
                                                error={usernameInUseMessageVisible} />
                                            {usernameInUseMessageVisible &&
                                                <Typography variant="caption" color="error">Username is already in use</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField type="password" className="form-control" id="password" name="password" variant="standard"
                                                inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "new-password"}}
                                                autoComplete="new-password" value={userInfo.password} onChange={this.onChange} label="Password" fullWidth required />
                                            { userInfo.password &&
                                                <PasswordStrengthMeter score={zxcvbn(userInfo.password).score} />    
                                            }
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField type="password" className="form-control" id="password2" name="password2" variant="standard"
                                                inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "new-password"}}
                                                value={userInfo.password2} onChange={this.onChange} label="Confirm Password" fullWidth required
                                                error={passwordMismatchMessageVisible} />
                                            {passwordMismatchMessageVisible ?
                                                <Typography variant="caption" color="error">Passwords must match</Typography> : 
                                                <Typography variant="caption" color="primary">&nbsp;</Typography>
                                            }    
                                        </Grid>
                                        <Grid item container xs={12} sm={12} justifyContent="center">
                                            <Button variant="contained" color="primary" disabled={!formValid} type="submit">Register</Button>    
                                        </Grid>      
                                        <Grid item container xs={12} sm={12} justifyContent="center">
                                            <Typography variant="body1">Already have an Account? <Link to="/login">Log In</Link></Typography>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>                    
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    registrationErrors: state.auth.registrationErrors,
    isAuthenticated: state.auth.isAuthenticated 
});

const mapDispatchToProps = {
    registerUser,
    clearRegistrationErrors,
    requestUsernameEmail,
    setTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(RegisterUser));