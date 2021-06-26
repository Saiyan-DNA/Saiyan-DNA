import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});

const PrivateRoute = ({component: Component, auth, ...rest }) => (
    <Route {...rest}
        render={props => {
            if(auth.isLoading) {
                return <LoadingMessage message="Loading..." />;
            } else if(!auth.isAuthenticated) {
                return <Redirect to="/login" />;
            } else {
                return <Component {...props} /> ;   
            }
            
        }} 
    />
);

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)