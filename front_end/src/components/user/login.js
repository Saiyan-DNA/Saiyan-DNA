import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@mui/styles';

import { Button, Card, CardContent, Container, FormControl, Grid, Input, InputLabel, TextField, Typography } from '@mui/material';

import { userLogin, clearLoginError } from '../../actions/auth';
import { setTitle } from '../../actions/navigation';

const styles = theme => ({
    errorCaption: {
        marginTop: "0em",
        paddingTop: "0em",
        fontStyle: "italic"
    }
});

class Login extends React.Component {
    state = {
        username: "",
        password: "",
        showUsernameError: false,
        showPasswordError: false
    }

    static propTypes = {
        userLogin: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired,
        clearLoginError: PropTypes.func.isRequired,
        currentPath: PropTypes.string.isRequired,
        isAuthenticated: PropTypes.bool,
        loginError: PropTypes.string       
    }
    
    componentDidMount() {
        this.props.setTitle("Log In");
    }   

    componentDidUpdate() {
        switch (this.props.loginError) {
            case "username":
                if (!this.state.showUsernameError) this.setState({showUsernameError: true});
                break;
            case "password":
                if (!this.state.showPasswordError) this.setState({showPasswordError: true});
                break;
            default: 
                break;
        }   
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.userLogin(this.state.username, this.state.password);
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});

        if (e.target.id === "username")  {
            this.setState({showUsernameError: false});
            if (this.state.showUsernameError) this.props.clearLoginError();
        }

        if (e.target.id === "password") {
            this.setState({showPasswordError: false});
            if (this.state.showPasswordError) this.props.clearLoginError();
        }
    }

    loginDisabled = () => {
        const { username, password, showUsernameError, showPasswordError } = this.state;

        let disabled = (username == "" || password == "" || showUsernameError || showPasswordError);        

        return disabled
    }

    render() {
        const { classes, isAuthenticated, currentPath } = this.props
        const { username, password, showUsernameError, showPasswordError } = this.state

        if (isAuthenticated) {
            return <Redirect to={currentPath} />;
        } 

        return (
            <Container>
                <Grid container spacing={0} justifyContent="center">
                    <Grid item xs={10} sm={6} lg={4}>
                        <Card elevation={4}>
                            <CardContent>
                                <form onSubmit={this.onSubmit}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={10}>
                                            <TextField type="text" className="form-control" id="username" name="username" variant="standard"
                                                inputProps={{autoCapitalize: "none", autoCorrect: "none"}} onChange={this.onChange}
                                                value={username} label="Username / E-Mail Address" fullWidth required error={showUsernameError} />
                                            { showUsernameError &&
                                                <Typography variant="caption" color="error" className={classes.errorCaption}>Unknown Username</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={10}>
                                            <TextField type="password" className="form-control" id="password" name="password" variant="standard"
                                                onChange={this.onChange} value={password} label="Password" fullWidth required error={showPasswordError} />
                                            { showPasswordError &&
                                                <Typography variant="caption" color="error" className={classes.errorCaption}>Incorrect Password</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={10}>
                                            <div align="center" style={{marginTop: "1em"}}>
                                                <Button type="submit" variant="contained" color="primary" align="center" disabled={this.loginDisabled()}>
                                                    Log In
                                                </Button>
                                            </div>
                                            <p align="center">
                                                Don't have an account? <Link to="/register">Register</Link>
                                            </p>
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
    isAuthenticated: state.auth.isAuthenticated,
    currentPath: state.navigation.currentPath,
    loginError: state.auth.loginError
});

const mapDispatchToProps = {
    userLogin,
    clearLoginError,
    setTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Login));