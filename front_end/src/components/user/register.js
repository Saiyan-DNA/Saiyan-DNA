import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';

import { setTitle } from '../../actions/navigation';

class RegisterUser extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        password2: ""
    }

    static propTypes = {
        setTitle: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setTitle("Register");
    }

    onSubmit = e => {
        e.preventDefault();
        console.log('submit')
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    render() {
        const { username, email, password, password2 } = this.state

        return (
            <Container maxWidth="md">                    
                <div className="col-md-8 m-auto">
                    <div className="card card-body mt-5">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    onChange={this.onChange}
                                    value={username}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    onChange={this.onChange}
                                    value={email}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    onChange={this.onChange}
                                    value={password}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password2"
                                    onChange={this.onChange}
                                    value={password2}
                                />
                            </div>                        
                            <div className="form-group" align="center">
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                            <p align="center">
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </Container>
        )
    }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { setTitle })(RegisterUser);
