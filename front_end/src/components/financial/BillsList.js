import React from "react";
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Container = loadable(() => import('@mui/material/Container' /* webpackChunkName: "Material-Layout" */));
const FormControl = loadable(() => import('@mui/material/FormControl' /* webpackChunkName: "Material-Input" */));
const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Material-Layout" */));
const InputLabel = loadable(() => import('@mui/material/InputLabel' /* webpackChunkName: "Material-Input" */));
const MenuItem = loadable(() => import('@mui/material/MenuItem' /* webpackChunkName: "Material-Navigation" */));
const Select = loadable(() => import('@mui/material/Select' /* webpackChunkName: "Material-Input" */));


import { setTitle } from '../../actions/navigation';


const styles = theme => ({
    dashboard: {
        border: "1px solid #DCDCDC",
        padding: "0px",
        margin: "12px",
    }
});

class BillsList extends React.Component {
    state = {
        selectedMonth: "Jan-2022"
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,
        currentUser: PropTypes.object.isRequired
    }

    componentDidMount() {
        const { setTitle } = this.props;

        setTitle("Bills");
    }

    componentDidUpdate() {
        
    }

    changeMonth = (event) => {
        this.setState({selectedMonth: event.target.value});
    }

    render() {
        const { classes, isMobile } = this.props;
        
        const { selectedMonth } = this.state;

        return (
            <Container>
                <Grid container spacing={2} justifyContent={"flex-start"}>
                    <Grid container item xs={12} spacing={2} justifyContent={"space-between"}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Select name="monthSelector" id="monthSelector" variant="outlined" fullWidth={true}
                                value={selectedMonth} onChange={this.changeMonth}>
                                <MenuItem value="Jan-2022">January 2022 (Current)</MenuItem>
                                <MenuItem value="Dec-2021">December 2021</MenuItem>
                                <MenuItem value="Nov-2021">November 2021</MenuItem>
                            </Select>
                        </Grid>                        
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    isMobile: state.auth.isMobile,
});

const mapDispatchToProps = {
    setTitle,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (BillsList)));