import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material-Layout" */));

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material-Navigation" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material-Layout" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material-Layout" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material-Layout" */));
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material-Layout" */));
const ListItemText = loadable(() => import('@material-ui/core/ListItemText' /* webpackChunkName: "Material-Layout" */));
const MenuItem = loadable(() => import('@material-ui/core/MenuItem' /* webpackChunkName: "Material-Layout" */));
const Select = loadable(() => import('@material-ui/core/Select' /* webpackChunkName: "Material-Input" */));
const TextField = loadable(() => import('@material-ui/core/TextField' /* webpackChunkName: "Material-Input" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material-Layout" */));

import { setTitle } from '../../actions/navigation';
import { getOrganizations } from '../../actions/organizations';

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    },
    emptyMessage: {
        textAlign: "center",
        fontStyle: "italic",
        marginTop: "12px",
        marginBottom: "12px",
        marginLeft: "auto",
        marginRight: "auto"
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
    constructor(props) {
        super(props);
    }

    orgTypes = [
        { value: "ALL", label: "All Types" }, 
        { value: "CTY", label: "Charity" },
        { value: "CRA", label: "Credit Reporting Agency"},
        { value: "EDU", label: "Education" },
        { value: "FIN", label: "Financial" },
        { value: "GOV", label: "Government" },
        { value: "MED", label: "Medical" },
        { value: "OTH", label: "Other" },
        { value: "POL", label: "Political" },
        { value: "RLG", label: "Religious" },
        { value: "RTL", label: "Retail" },
        { value: "SVC", label: "Service" }
    ]

    state = {
        filter: { value: "ALL", label: "All"},
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
        user: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.props.setTitle("Organizations");
        this.props.getOrganizations();
        this.updateWindowDimensions();
    }

    componentDidUpdate() {
        const { organizations, organizationsLoaded } = this.props;
        const { filter, searchText, isDirty } = this.state;

        if (organizationsLoaded && isDirty) {
            this.setState({
                filteredOrganizations: filter.value === "ALL" ? organizations.filter(org => org.name.toLowerCase().includes(searchText.toLowerCase())) :
                    organizations.filter(org => org.organization_type === filter.value && org.name.toLowerCase().includes(searchText.toLowerCase())),
                isDirty: false
            });
        }
    }

    filterOrganizations = (e) => {
        const { filter } = this.state;

        if (filter.value != e.target.value) {
            this.setState({
                filter: this.orgTypes.filter(orgType => orgType.value === e.target.value)[0], 
                isDirty: true
            });

            return;
        }        
    }

    orgList(organizations, numToShow) {
        var { classes } = this.props;

        var showMore = numToShow < organizations.length ? true : false;

        return (
            <List>
                {organizations.slice(0, numToShow).map(org => (
                    <ListItem key={org.id} button divider onClick={() => {console.log(`Edit '${org.name}'`)}}>
                        <Grid container spacing={0} justifyContent="space-between">
                            <Grid item xs={12}>
                                <Typography variant="body1">{org.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="caption" color="primary" className={classes.listCaption}>{this.orgTypes.filter(type => type.value === org.organization_type)[0].label}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
                { showMore && (
                    <ListItem key="more" button divider onClick={this.showMore}>
                        <Grid container spacing={0} justifyContent="center">
                            <Grid item>
                                <ListItemText primary="Show More..." className={classes.showMore} />
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
            </List>
        )
    }

    showMore = () => {
        const { numOrganizations } = this.state;

        this.setState({numOrganizations: numOrganizations + 10});
        return;
    }

    searchList = (e) => {
        this.setState({
            searchText: e.target.value,
            isDirty: true
        });

        return;
    }

    listFilters = () => {
        const { classes } = this.props;
        const { filter, searchText, width } = this.state;

        return(
            <Grid item container xs={12} sm={9} md={6} spacing={1} justifyContent={width < 600 ? "center" : "flex-start"}>
                <Grid item xs={width < 600 ? 12 : 6}>
                    <Select variant="outlined" size="small" id="typeFilter" name="typeFilter" className={classes.listFilter} fullWidth={true}
                        value={filter.value} defaultValue={filter.value} onChange={this.filterOrganizations}>
                        {this.orgTypes.map(type => (
                            <MenuItem key={type.value} value={type.value} className={classes.listFilter}>{type.label}</MenuItem>
                        ))}
                    </Select>
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

    render() {
        const { classes } = this.props;
        const { filter, filteredOrganizations, numOrganizations, width } = this.state;        

        return(
            <Container>
                <Grid container spacing={2} justifyContent="space-between">
                    { width >= 600 && this.listFilters()}
                    <Grid item xs={12} sm={3} md={6} align="right" className={classes.hideForPrint}>
                        <Button variant="contained" color="primary" size="small">Add Organization</Button>
                    </Grid>
                    { width < 600 && this.listFilters()}
                    <Grid item xs={12}>
                        <Card elevation={4}>
                            { filteredOrganizations.length == 0 ? 
                                <Typography variant="body1" className={classes.emptyMessage}>No {filter.label} Organizations Found.</Typography> :
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
    user: state.auth.user || {},
});

const mapDispatchToProps = {
    setTitle,
    getOrganizations
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(OrganizationsList));