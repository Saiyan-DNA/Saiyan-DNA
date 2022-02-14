import React from 'react';
import { render } from 'react-dom';
import loadable from '@loadable/component';

import createTheme from '@mui/material/styles/createTheme';

const Provider = loadable(() => import('react-redux' /* webpackChunkName: "Core" */).then(m => m.Provider));
const Router = loadable(() => import('react-router-dom' /* webpackChunkName: "Core" */).then(m => m.HashRouter));
const Route = loadable(() => import('react-router-dom' /* webpackChunkName: "Core" */).then(m => m.Route));
const Switch = loadable(() => import('react-router-dom' /* webpackChunkName: "Core" */).then(m => m.Switch));

const ThemeProvider = loadable(() => import('@mui/material/styles/ThemeProvider' /* webpackChunkName: "Common" */));

const LoadingMessage = loadable(() => import('./common/LoadingMessage' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const PrivateRoute = loadable(() => import('./common/PrivateRoute' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const SystemMessage = loadable(() => import('./common/SystemMessage' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});
const TimeoutModal = loadable(() => import('./common/TimeoutModal' /* webpackChunkName: "Common" */), {fallback: <div>&nbsp;</div>});

const Header = loadable(() => import('./layout/header' /* webpackChunkName: "Common" */));
const NavMenu = loadable(() => import('./layout/navmenu' /* webpackChunkName: "Common" */));
const UserMenu = loadable(() => import('./layout/UserMenu' /* webpackChunkName: "Common" */));
const Login = loadable(() => import('./user/login' /* webpackChunkName: "User" */), {fallback: <LoadingMessage message="Loading Login..." />});
const PendingUser = loadable(() => import('./user/PendingUser' /* webpackChunkName: "User" */), {fallback: <LoadingMessage message="Loading Information" />});
const RegisterUser = loadable(() => import('./user/RegisterUser' /* webpackChunkName: "User" */), {fallback: <LoadingMessage message="Loading Registration Form..." />});
const Dashboard = loadable(() => import('./Dashboard' /* webpackChunkName: "Dashboard" */), {fallback: <LoadingMessage message="Loading Dashboard..." />});

const FinancialDashboard = loadable(() => import('./financial/FinancialDashboard' /* webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Dashboard..." />});
const FinancialAccounts = loadable(() => import('./financial/FinancialAccounts' /* webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Accounts..." />});
const AccountInfo = loadable(() => import('./financial/AccountInfo' /* webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Account Information..." />});
const AccountOverview = loadable(() => import('./financial/AccountOverview' /* webpackChunkName: "Financial" */), {fallback:<LoadingMessage message="Loading Account..." />});
const AssetsList = loadable(() => import('./financial/AssetsList' /*webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Assets..." />});
const TransactionDetail = loadable(() => import('./financial/TransactionDetail' /*webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Transaction..." />});
const BillsList = loadable(() => import('./financial/BillsList' /*webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Bills..." />});

const HomeList = loadable(() => import('./manage/HomeList' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Homes..." />});
const OrganizationsList = loadable(() => import('./manage/OrganizationsList' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Organizations..." />});
const OrganizationDetail = loadable(() => import('./manage/OrganizationDetail' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Organization Detail..." />});
const PeopleList = loadable(() => import('./manage/PeopleList' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading People..." />});
const CategoryList = loadable(() => import('./inventory/Categorylist' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Categories..." />})
const CategoryInfo = loadable(() => import('./inventory/Categoryinfo' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Category Detail..." />})

import { checkTokenExpiration, loadUser } from '../actions/auth';
import store from '../store';

const theme = createTheme({
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
        },
        text: {
            primary:  "#2b373f"
        },
        success: {
            main: "#4a934a"
        },
        warning: {
            main: "#ff9900"
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
                <ThemeProvider theme={theme}>
                    <Router>
                        <Header />
                        <NavMenu />
                        <UserMenu />
                        <TimeoutModal />
                        <Switch>
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/register" component={RegisterUser} />
                            <Route exact path="/pendinguser" component={PendingUser} />
                            <PrivateRoute exact path="/" component={Dashboard} />
                            <PrivateRoute exact path="/financial" component={FinancialDashboard} />
                            <PrivateRoute exact path="/financial/accounts" component={FinancialAccounts} />
                            <PrivateRoute exact path="/financial/accountinfo" component={AccountInfo} />
                            <PrivateRoute exact path="/financial/accountoverview" component={AccountOverview} />
                            <PrivateRoute exact path="/financial/assets" component={AssetsList} />
                            <PrivateRoute exact path="/financial/bills" component={BillsList} />
                            <PrivateRoute exact path="/financial/transaction" component={TransactionDetail} />                          
                            <PrivateRoute exact path="/manage/homes" component={HomeList} />
                            <PrivateRoute exact path="/manage/organizations" component={OrganizationsList} />
                            <PrivateRoute exact path="/manage/organizationdetail" component={OrganizationDetail} />
                            <PrivateRoute exact path="/manage/people" component={PeopleList} />
                            <PrivateRoute exact path="/inventory/categories" component={CategoryList} />
                            <PrivateRoute exact path="/inventory/categoryinfo" component={CategoryInfo} />
                        </Switch>
                    </Router>
                    <SystemMessage />
                </ThemeProvider>
            </Provider>
        );
    }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);