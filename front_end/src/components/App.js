import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import loadable from '@loadable/component';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { loadUser } from '../actions/auth';
import store from '../store';
import PrivateRoute from './common/PrivateRoute';

const LoadingMessage = loadable(() => import('./common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});

const Header = loadable(() => import('./layout' /* webpackChunkName: "Layout" */).then(m => m.Header));
const NavMenu = loadable(() => import('./layout' /* webpackChunkName: "General" */).then(m => m.NavMenu));
const SystemMessage = loadable(() => import('./common/SystemMessage' /* webpackChunkName: "General" */));
const Login = loadable(() => import('./user' /* webpackChunkName: "General" */).then(m => m.Login), {fallback: <LoadingMessage message="Loading Login..." />});
const RegisterUser = loadable(() => import('./user' /* webpackChunkName: "General" */).then(m => m.RegisterUser), {fallback: <LoadingMessage message="Loading Registration Form..." />});
const Dashboard = loadable(() => import('./Dashboard' /* webpackChunkName: "General" */), {fallback: <LoadingMessage message="Loading Dashboard..." />});

const FinancialAccounts = loadable(() => import('./financial/FinancialAccounts' /* webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Accounts..." />});
const AccountInfo = loadable(() => import('./financial/AccountInfo' /* webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Account Information..." />});
const AccountOverview = loadable(() => import('./financial/AccountOverview' /* webpackChunkName: "Financial" */), {fallback:<LoadingMessage message="Loading Account..." />});
const AssetsList = loadable(() => import('./financial/Assets' /*webpackChunkName: "Financial" */), {fallback: <LoadingMessage message="Loading Assets..." />});

const HomeList = loadable(() => import('./manage/HomeList' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Homes..." />});
const PeopleList = loadable(() => import('./manage/PeopleList' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading People..." />});
const CategoryList = loadable(() => import('./inventory/CategoryList' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Categories..." />})
const CategoryInfo = loadable(() => import('./inventory/CategoryInfo' /* webpackChunkName: "Manage" */), {fallback: <LoadingMessage message="Loading Category Detail..." />})


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
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <Router>
                <Header />
                <NavMenu />
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={RegisterUser} />
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <PrivateRoute exact path="/financial/accounts" component={FinancialAccounts} />
                  <PrivateRoute exact path="/financial/accountinfo" component={AccountInfo} />
                  <PrivateRoute exact path="/financial/accountoverview" component={AccountOverview} />
                  <PrivateRoute exact path="/financial/assets" component={AssetsList} />
                  <PrivateRoute exact path="/manage/homes" component={HomeList} />
                  <PrivateRoute exact path="/manage/people" component={PeopleList} />
                  <PrivateRoute exact path="/inventory/categories" component={CategoryList} />
                  <PrivateRoute exact path="/inventory/categoryinfo" component={CategoryInfo} />
                </Switch>
            </Router>
            {SystemMessage && <SystemMessage />}
        </MuiThemeProvider>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  message: state.message,
});

export default withRouter(connect(mapStateToProps, { loadUser })(App));

const container = document.getElementById("app");
render(<App />, container);