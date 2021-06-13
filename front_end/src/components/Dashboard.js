import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material" */));

import { setTitle } from '../actions/navigation';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading"
        };
    }

    static propTypes = {
        setTitle: PropTypes.func.isRequired,
        firstName: PropTypes.string,
        lastName: PropTypes.string
    };

    componentDidMount() {
        this.props.setTitle("Home Central");
    }

    render() {
        return (
            <>
                <Container>                    
                    <Typography align="center">Welcome home, {this.props.firstName}!</Typography>
                </Container>
            </>
        )
    }
}

const mapStateToProps = state => ({
    firstName: state.auth.user.first_name,
    lastName: state.auth.user.last_name
});

export default connect(mapStateToProps, { setTitle })(Dashboard);
