import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import zxcvbn from 'zxcvbn';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import PasswordStrengthMeter from './PasswordStrengthMeter';

import { setTitle } from '../../actions/navigation';
import { registerUser, clearRegistrationErrors } from '../../actions/auth';

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
        submittedUsername: ""
    }

    static propTypes = {
        registrationErrors: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        setTitle: PropTypes.func.isRequired,
        registerUser: PropTypes.func.isRequired,
        clearRegistrationErrors: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setTitle("Register");
    }

    componentDidUpdate() {
        var registrationErrors = this.props.registrationErrors;

        if (registrationErrors.username && !this.state.usernameInUseMessageVisible) {
            this.toggleUsernameInUseMessage(true);
        }
        if (!registrationErrors.username && this.state.usernameInUseMessageVisible) {
            this.toggleUsernameInUseMessage(false);
        }

        if (registrationErrors.email) console.log(this.props.registrationErrors.email);
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
            this.togglePasswordMismatchMessage(true);
            isValid = false;
        } else {
            this.togglePasswordMismatchMessage(false);
        }

        // Clear Registration Errors if user has modified username
        if (userInfo.userName != this.state.submittedUsername && this.state.usernameInUseMessageVisible) {
            this.props.clearRegistrationErrors();
        }
        
        // Password Validation - Validate Password Strength (using zxcvbn)
        if (zxcvbn(userInfo.password).score < 3) {
            isValid = false;
        }

        return isValid;
    }

    togglePasswordMismatchMessage = (mismatch) => {
        this.setState({passwordMismatchMessageVisible: mismatch});
    }

    toggleUsernameInUseMessage = (inuse) => {
        this.setState({usernameInUseMessageVisible: inuse});
    }

    registerUser = (e) => {
        e.preventDefault();

        this.setState({submittedUsername: this.state.userInfo.userName})
        this.props.registerUser({
            "first_name": this.state.userInfo.firstName,
            "last_name": this.state.userInfo.lastName,
            "email": this.state.userInfo.email,
            "username": this.state.userInfo.userName,
            "password": this.state.userInfo.password
        });
    }

    render() {
        const { userInfo, formValid, passwordMismatchMessageVisible } = this.state

        if (this.props.isAuthenticated) {
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
                                                {this.state.usernameInUseMessageVisible &&
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

export default connect(mapStateToProps, { registerUser, clearRegistrationErrors, setTitle })(RegisterUser);
