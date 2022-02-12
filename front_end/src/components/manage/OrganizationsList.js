import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import { Button, Card, Container, Grid, List, ListItem, ListItemButton, TextField, Typography } from '@mui/material';

const ArrowUp = loadable(() => import('@mui/icons-material/KeyboardArrowUp' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});
const ArrowDown = loadable(() => import('@mui/icons-material/KeyboardArrowDown' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});

import { setTitle } from '../../actions/navigation';
import { getOrganizations, getOrganization, clearOrganization } from '../../actions/organizations';
import OrganizationTypeSelect from './controls/OrganizationTypeSelect';

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    },
    emptyMessage: {
        textAlign: "center",
        fontStyle: "italic",
        marginTop: "2em",
        marginBottom: "2em",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "4em"
    },
    listCaption: {
        margin: "0em",
        padding: "0em",
        fontStyle: "italic",
        verticalAlign: "text-top",
    },
    listFilter: {
        maxHeight: "2.5em",
        minWidth: "12em"  
    },
    showMore: {
        fontStyle: "italic",
        fontSize: "0.6em"
    }
});

class OrganizationsList extends React.Component {
    state = {
        filter: "ALL",
        filteredOrganizations: [],
        searchText: "",
        isDirty: true,
        numOrganizations: 10,
        width: 0,
        height: 0,
    }

    static propTypes = {
        setTitle: PropTypes.func.isRequired,
        getOrganizations: PropTypes.func.isRequired,
        organizations: PropTypes.array.isRequired,
        organizationsLoading: PropTypes.bool.isRequired,
        organizationsLoaded: PropTypes.bool.isRequired,
        organizationSaving: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const { setTitle, getOrganizations, organizationsLoaded, organizationsLoading } = this.props;
        
        setTitle("Organizations");

        if (!organizationsLoaded && !organizationsLoading) {
            getOrganizations();
        }

        this.updateWindowDimensions();
    }

    componentDidUpdate() {
        const { organizations, organizationsLoaded, organizationsLoading, organizationSaving } = this.props;
        const { filter, searchText, isDirty } = this.state;

        if (organizationsLoaded && isDirty) {
            this.setState({
                filteredOrganizations: filter === "ALL" ? organizations.filter(org => org.name.toLowerCase().includes(searchText.toLowerCase())) :
                    organizations.filter(org => org.organization_type.value === filter && org.name.toLowerCase().includes(searchText.toLowerCase())),
                isDirty: false
            });
        }

        if (!organizationsLoaded && !organizationsLoading && !organizationSaving) {
            this.props.getOrganizations();
        }
    }

    emptyMessage() {
        const { classes, organizationsLoading } = this.props;

        return (
            <Typography variant="body1" className={classes.emptyMessage}>
                { organizationsLoading ? "Loading Organizations..." : "No Organizations Found." }
            </Typography>
        )

    }

    filterOrganizations = (e) => {
        const { filter } = this.state;

        if (filter != e.target.value) {
            this.setState({
                filter: e.target.value, 
                isDirty: true
            });

            return;
        }        
    }

    orgList(organizations, numToShow) {
        var { classes } = this.props;

        var showMore = numToShow < organizations.length ? true : false;
        var showLess = numToShow > 10 ? true : false;

        return (
            <List>
                {organizations.slice(0, numToShow).map(org => (
                    <ListItemButton key={org.id} divider onClick={() => {this.actionViewOrganization(org.id)}}>
                        <Grid container spacing={0} justifyContent="space-between">
                            <Grid item xs={12}>
                                <Typography variant="body1">{org.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="caption" color="primary" className={classes.listCaption}>{org.organization_type.label}</Typography>
                            </Grid>
                        </Grid>
                    </ListItemButton>
                ))}
                { (showLess || showMore) && (
                    <ListItem disableGutters>
                        <Grid container spacing={0} justifyContent="center">
                            { showLess && 
                                <Grid item alignItems="center" onClick={this.showLess}>
                                    <Button color="inherit" fullWidth={true} className={classes.showMore} size="small"
                                        startIcon={<ArrowUp />} endIcon={<ArrowUp />}>Show Less</Button>
                                </Grid>
                            }
                            { (showLess && showMore) && <Grid item xs={"auto"}><Divider orientation="vertical" light={true} /></Grid> }
                            { showMore &&
                                <Grid item alignItems="center" onClick={this.showMore}>
                                    <Button color="inherit" fullWidth={true} className={classes.showMore} size="small"
                                        startIcon={<ArrowDown />} endIcon={<ArrowDown />}>Show More</Button>
                                </Grid>
                            }
                        </Grid>
                    </ListItem>
                )}
            </List>
        )
    }

    showMore = () => {
        const { numOrganizations } = this.state;
        this.setState({numOrganizations: numOrganizations + 10});
    }

    showLess = () => {
        let newCount = this.state.numOrganizations - 10;
        this.setState({numOrganizations: newCount < 10 ? 10 : newCount});
    }

    searchList = (e) => {
        this.setState({searchText: e.target.value, isDirty: true});
    }

    listFilters = () => {
        const { classes } = this.props;
        const { filter, searchText, width } = this.state;

        return(
            <Grid item container xs={12} sm={9} md={6} spacing={1} justifyContent={width < 600 ? "center" : "flex-start"}>
                <Grid item xs={width < 600 ? 12 : 6}>
                    <OrganizationTypeSelect variant={"outlined"} value={filter} defaultValue={filter} 
                        showLabel={false} onChange={this.filterOrganizations} className={classes.listFilter} />
                </Grid>
                <Grid item xs={width < 600 ? 12 : 6}>
                    <TextField variant="outlined" size="small" id="searchOrganizations" name="searchOrganizations" fullWidth={true}
                        autoComplete="none" value={searchText} placeholder="Search..." onChange={this.searchList} />
                </Grid>
            </Grid>
        )
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    actionAddOrganization = () => {
        this.props.clearOrganization();
        this.props.history.push("/manage/organizationdetail");
    }

    actionViewOrganization = (id) => {
        const { currentOrganization, getOrganization, history } = this.props;

        if (!currentOrganization || currentOrganization.id != id) {
            getOrganization(id);
            history.push("/manage/organizationdetail");
        }
    }

    render() {
        const { classes } = this.props;
        const { filteredOrganizations, numOrganizations, width } = this.state;        

        return(
            <Container>
                <Grid container spacing={2} justifyContent="space-between">
                    { width >= 600 && this.listFilters()}
                    <Grid item xs={12} sm={3} md={6} align="right" className={classes.hideForPrint}>
                        <Button variant="contained" color="primary" size="small" onClick={this.actionAddOrganization}>Add Organization</Button>
                    </Grid>
                    { width < 600 && this.listFilters()}
                    <Grid item xs={12}>
                        <Card elevation={4}>
                            { filteredOrganizations.length == 0 ? 
                                this.emptyMessage() :
                                this.orgList(filteredOrganizations, numOrganizations)
                            }
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    organizations: state.organizations.organizations || [],
    organizationsLoading: state.organizations.organizationsLoading,
    organizationsLoaded: state.organizations.organizationsLoaded,
    organizationSaving: state.organizations.organizationSaving,
    user: state.auth.user || {},
});

const mapDispatchToProps = {
    setTitle,
    getOrganizations,
    getOrganization,
    clearOrganization,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(OrganizationsList));