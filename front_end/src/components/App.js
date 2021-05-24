import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import loadable from '@loadable/component';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { loadUser } from '../actions/auth';
import store from '../store';
import PrivateRoute from './common/PrivateRoute';

const Header = loadable(() => import('./layout' /* webpackChunkName: "General" */).then(m => m.Header), {fallback: <h1>Loading Header...</h1>});
const NavMenu = loadable(() => import('./layout' /* webpackChunkName: "General" */).then(m => m.NavMenu), {fallback: <h1>Loading Menu...</h1>});
const Login = loadable(() => import('./user' /* webpackChunkName: "General" */).then(m => m.Login), {fallback: <h1>Loading Login...</h1>});
const RegisterUser = loadable(() => import('./user' /* webpackChunkName: "General" */).then(m => m.RegisterUser), {fallback: <h1>Loading Register...</h1>});
const Dashboard = loadable(() => import('./Dashboard' /* webpackChunkName: "General" */), {fallback: <h1>Loading Dashboard...</h1>});

const FinancialAccounts = loadable(() => import('./financial/FinancialAccounts' /* webpackChunkName: "Financial" */), {fallback: <h1>Loading Accounts...</h1>});
const AccountInfo = loadable(() => import('./financial/AccountInfo' /* webpackChunkName: "Financial" */), {fallback: <h1>Loading Account Info...</h1>});
const AccountOverview = loadable(() => import('./financial/AccountOverview' /* webpackChunkName: "Financial" */), {fallback: <h1>Loading Account...</h1>});
const AssetsList = loadable(() => import('./financial/Assets' /*webpackChunkName: "Financial" */), {fallback: <h1>Loading Assets...</h1>});

const HomeList = loadable(() => import('./manage/HomeList' /* webpackChunkName: "Manage" */), {fallback: <h1>Loading Homes...</h1>});
const PeopleList = loadable(() => import('./manage/PeopleList' /* webpackChunkName: "Manage" */), {fallback: <h1>Loading People...</h1>});
const CategoryList = loadable(() => import('./inventory/CategoryList' /* webpackChunkName: "Manage" */), {fallback: <h1>Loading Categories...</h1>})
const CategoryInfo = loadable(() => import('./inventory/CategoryInfo' /* webpackChunkName: "Manage" */), {fallback: <h1>Loading Category...</h1>})


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
        </MuiThemeProvider>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  message: state.message
});

export default withRouter(connect(mapStateToProps, { loadUser })(App));

const container = document.getElementById("app");
render(<App />, container);
