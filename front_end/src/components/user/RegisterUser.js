import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import zxcvbn from 'zxcvbn';

import { withStyles } from '@material-ui/core/styles';

const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Layout" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Layout" */));
const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material" */));

const PasswordStrengthMeter = loadable(() => import('./PasswordStrengthMeter' /*webpackChunkName: "General" */));

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
                <Grid container spacing={0} justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <Card elevation={4}>
                            <CardContent>
                                <form onSubmit={this.registerUser}>
                                    <Grid container spacing={2} justify="space-between">
                                        <Grid item container xs={12} sm={12} justify="center">
                                            <Typography variant="h5">Register a New Account</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="firstName">First Name</InputLabel>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="firstName"
                                                    name="firstName"
                                                    inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "off"}}
                                                    onChange={this.onChange}
                                                    value={userInfo.firstName}
                                                />
                                            </FormControl>    
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="lastName"
                                                    name="lastName"
                                                    inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "off"}}
                                                    onChange={this.onChange}
                                                    value={userInfo.lastName}
                                                />
                                            </FormControl>    
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="email">E-Mail Address</InputLabel>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "off"}}
                                                    onChange={this.onChange}
                                                    value={userInfo.email}
                                                />
                                            </FormControl>
                                            { emailInUseMessageVisible &&
                                                <Typography variant="caption" color="error">
                                                    This e-mail is already in use. Click <a href="#" className={classes.linkText} onClick={() => {requestUsernameEmail(userInfo.email)}}>here</a> to retrieve your username.
                                                </Typography>
                                            }    
                                        </Grid>
                                        <Grid item container xs={12} sm={12} spacing={0} justify="flex-start">
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth={true}>
                                                    <InputLabel htmlFor="userName">Username</InputLabel>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        id="userName"
                                                        name="userName"
                                                        inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "new-username"}}
                                                        autoComplete="new-username"
                                                        onChange={this.onChange}
                                                        value={userInfo.userName}
                                                    />
                                                </FormControl>
                                                {usernameInUseMessageVisible &&
                                                    <Typography variant="caption" color="error">Username is already in use</Typography>
                                                }    
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="password">Password</InputLabel>
                                                <Input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    name="password"
                                                    inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "new-password"}}
                                                    autoComplete="new-password"
                                                    onChange={this.onChange}
                                                    value={userInfo.password}
                                                />
                                            </FormControl>
                                            { userInfo.password &&
                                                <PasswordStrengthMeter score={zxcvbn(userInfo.password).score} />    
                                            }
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="password">Re-Enter Password</InputLabel>
                                                <Input
                                                    type="password"
                                                    className="form-control"
                                                    id="password2"
                                                    name="password2"
                                                    inputProps={{autoCapitalize: "none", autoCorrect: "none", autoComplete: "new-password"}}
                                                    autoComplete="new-password"
                                                    onChange={this.onChange}
                                                    value={userInfo.password2}
                                                />
                                            </FormControl>
                                            {passwordMismatchMessageVisible ?
                                                <Typography variant="caption" color="error">Passwords must match</Typography> : 
                                                <Typography variant="caption" color="primary">&nbsp;</Typography>
                                            }    
                                        </Grid>
                                        <Grid item container xs={12} sm={12} justify="center">
                                            <Button variant="contained" color="primary" disabled={!formValid} type="submit">Register</Button>    
                                        </Grid>      
                                        <Grid item container xs={12} sm={12} justify="center">
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

export default connect(mapStateToProps, { registerUser, clearRegistrationErrors, requestUsernameEmail, setTitle })(withStyles(styles, {withTheme: true})(RegisterUser));