import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Layout" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Layout" */));
const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material" */));

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

    render() {
        const { classes, isAuthenticated, currentPath } = this.props
        const { username, password, showUsernameError, showPasswordError } = this.state

        if (isAuthenticated) {
            return <Redirect to={currentPath} />;
        } 

        return (
            <Container>
                <Grid container spacing={0} justify="center">
                    <Grid item xs={10} sm={6} lg={4}>
                        <Card elevation={4}>
                            <CardContent>
                                <form onSubmit={this.onSubmit}>
                                    <Grid container spacing={2} justify="center">
                                        <Grid item xs={10}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="username">Username</InputLabel>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    name="username"
                                                    inputProps={{autoCapitalize: "none", autoCorrect: "none"}}
                                                    onChange={this.onChange}
                                                    value={username}
                                                />
                                            </FormControl>
                                            { showUsernameError &&
                                                <Typography variant="caption" color="error" className={classes.errorCaption}>Unknown Username</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={10}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="password">Password</InputLabel>
                                                <Input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    onChange={this.onChange}
                                                    value={password}
                                                />
                                            </FormControl>
                                            { showPasswordError &&
                                                <Typography variant="caption" color="error" className={classes.errorCaption}>Incorrect Password</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={10}>
                                            <div align="center" style={{marginTop: "1em"}}>
                                                <Button type="submit" variant="contained" color="primary" align="center">
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

export default connect(mapStateToProps, { userLogin, clearLoginError, setTitle })(withStyles(styles, { withTheme: true })(Login));