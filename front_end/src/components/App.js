import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import loadable from '@loadable/component';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { checkTokenExpiration, loadUser } from '../actions/auth';
import store from '../store';
import PrivateRoute from './common/PrivateRoute';

const LoadingMessage = loadable(() => import('./common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});

const Header = loadable(() => import('./layout' /* webpackChunkName: "Layout" */).then(m => m.Header));
const NavMenu = loadable(() => import('./layout' /* webpackChunkName: "General" */).then(m => m.NavMenu));
const UserMenu = loadable(() => import('./layout' /* webpackChunkName: "Navigation" */).then(m => m.UserMenu));
const SystemMessage = loadable(() => import('./common/SystemMessage' /* webpackChunkName: "General" */));
const Login = loadable(() => import('./user' /* webpackChunkName: "General" */).then(m => m.Login), {fallback: <LoadingMessage message="Loading Login..." />});
const RegisterUser = loadable(() => import('./user' /* webpackChunkName: "General" */).then(m => m.RegisterUser), {fallback: <LoadingMessage message="Loading Registration Form..." />});
const Dashboard = loadable(() => import('./Dashboard' /* webpackChunkName: "General" */), {fallback: <LoadingMessage message="Loading Dashboard..." />});

const FinancialAccounts = loadable(() => import('./financial' /* webpackChunkName: "Financial" */).then(m => m.FinancialAccounts), {fallback: <LoadingMessage message="Loading Accounts..." />});
const AccountInfo = loadable(() => import('./financial' /* webpackChunkName: "Financial" */).then(m => m.AccountInfo), {fallback: <LoadingMessage message="Loading Account Information..." />});
const AccountOverview = loadable(() => import('./financial' /* webpackChunkName: "Financial" */).then(m => m.AccountOverview), {fallback:<LoadingMessage message="Loading Account..." />});
const AssetsList = loadable(() => import('./financial' /*webpackChunkName: "Financial" */).then(m => m.AssetsList), {fallback: <LoadingMessage message="Loading Assets..." />});
const TransactionDetail = loadable(() => import('./financial' /*webpackChunkName: "Financial" */).then(m => m.TransactionDetail), {fallback: <LoadingMessage message="Loading Transaction..." />});

const HomeList = loadable(() => import('./manage' /* webpackChunkName: "Manage" */).then(m => m.HomeList), {fallback: <LoadingMessage message="Loading Homes..." />});
const PeopleList = loadable(() => import('./manage' /* webpackChunkName: "Manage" */).then(m => m.PeopleList), {fallback: <LoadingMessage message="Loading People..." />});
const CategoryList = loadable(() => import('./inventory' /* webpackChunkName: "Manage" */).then(m => m.CategoryList), {fallback: <LoadingMessage message="Loading Categories..." />})
const CategoryInfo = loadable(() => import('./inventory' /* webpackChunkName: "Manage" */).then(m => m.CategoryInfo), {fallback: <LoadingMessage message="Loading Category Detail..." />})

const TimeoutModal = loadable(() => import('./common/TimeoutModal' /* webpackChunkName "General" */), {fallback: <div>&nbsp;</div>});

const theme = createMuiTheme({
    typography: {
      fontFamily: "inherit"
    },
    palette: {
        primary: {
            main: "#0ca2d0",
            destructive: "#ba000d",
            destructiveLight: "#f44336",
            contrastText: "#ffffff"
            
        },
        secondary: {
            main: "#1769aa",
            contrastText: "#ffffff"
        }
    },
    status: {
      danger: "#c62828",
    },
});

class App extends React.Component {
    componentDidMount() {
        store.dispatch(checkTokenExpiration());
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <Router>
                        <Header />
                        <NavMenu />
                        <UserMenu />
                        <TimeoutModal />
                        <Switch>
                          <Route exact path="/login" component={Login} />
                          <Route exact path="/register" component={RegisterUser} />
                          <PrivateRoute exact path="/" component={Dashboard} />
                          <PrivateRoute exact path="/financial/accounts" component={FinancialAccounts} />
                          <PrivateRoute exact path="/financial/accountinfo" component={AccountInfo} />
                          <PrivateRoute exact path="/financial/accountoverview" component={AccountOverview} />
                          <PrivateRoute exact path="/financial/assets" component={AssetsList} />
                          <PrivateRoute exact path="/financial/transaction" component={TransactionDetail} />
                          <PrivateRoute exact path="/manage/homes" component={HomeList} />
                          <PrivateRoute exact path="/manage/people" component={PeopleList} />
                          <PrivateRoute exact path="/inventory/categories" component={CategoryList} />
                          <PrivateRoute exact path="/inventory/categoryinfo" component={CategoryInfo} />
                        </Switch>
                    </Router>
                    <SystemMessage />
                </MuiThemeProvider>
            </Provider>
        );
    }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default withRouter(connect(mapStateToProps, { loadUser, checkTokenExpiration })(App));

const container = document.getElementById("app");
render(<App />, container);