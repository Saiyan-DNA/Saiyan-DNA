import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';


import { userLogin } from '../../actions/auth';
import { setTitle } from '../../actions/navigation';


class Login extends React.Component {
    state = {
        username: "",
        password: ""
    }

    static propTypes = {
        userLogin: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired,
        currentPath: PropTypes.string.isRequired,
        isAuthenticated: PropTypes.bool        
    }
    
    componentDidMount() {
        this.props.setTitle("Log In");
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.userLogin(this.state.username, this.state.password);
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to={this.props.currentPath} />;
        }

        const { username, password } = this.state

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
    currentPath: state.navigation.currentPath
});

export default connect(mapStateToProps, { userLogin, setTitle })(Login);
