import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Box = loadable(() => import('@material-ui/core/Box' /* webpackChunkName: "Material-Layout" */));
const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material-Navigation" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material-Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Material-Layout" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material-Layout" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material-Layout" */));

const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material-Input" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material-Input" */));
const Input = loadable(() => import('@material-ui/core/Input' /* webpackChunkName: "Material-Input" */));

import { setTitle } from '../../actions/navigation';
import { saveOrganization } from '../../actions/organizations';
import OrganizationTypeSelect from './controls/OrganizationTypeSelect';

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    }
});

class OrganizationDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        id: null,
        name: "",
        organizationType: "",
        url: "",
        isDirty: true,
    }

    static propTypes = {
        setTitle: PropTypes.func.isRequired,
        saveOrganization: PropTypes.func.isRequired,
        organization: PropTypes.object.isRequired,
        organizationLoading: PropTypes.bool.isRequired,
        organizationLoaded: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const { organization } = this.props;

        this.props.setTitle(organization.name || "New Organization");

        if (organization.id) {
            this.setState({
                id: organization.id,
                name: organization.name,
                organizationType: organization.organizationType.value,
                url: organization.url,
            });
        }
    }

    saveOrganization = () => {
        const { id, name, organizationType, url } = this.state;
        const { user } = this.props;

        this.props.saveOrganization({
            id: id, 
            name: name, 
            organization_type: organizationType,
            website_url: url,
            created_by: user.id
        });

        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;
        const { id, name, organizationType, url, isDirty } = this.state;      

        return(
            <Container>
                <Box component="form" autoComplete="off">
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs={6} align="left" className={classes.hideForPrint}>
                            <Button variant="outlined" color="primary" size="small" onClick={() => {this.props.history.goBack()}}>Back</Button>
                        </Grid>
                        <Grid item xs={6} align="right" className={classes.hideForPrint}>
                            <Button variant="contained" color="primary" size="small" onClick={this.saveOrganization}>
                                {id ? "Save" : "Add"}</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Grid container spacing={2} justifyContent="space-between">
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="name">Name</InputLabel>
                                                <Input id="name" name="name" placeholder="Organization Name" required value={name} 
                                                    onChange={(e) => this.setState({name: e.target.value, isDirty: true})} />
                                            </FormControl>                                        
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <OrganizationTypeSelect required value={organizationType} showAllTypes={false}
                                                onChange={(e) => this.setState({organizationType: e.target.value, isDirty: true})} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth={true}>
                                                <InputLabel htmlFor="url">Website</InputLabel>
                                                <Input id="url" name="url" placeholder="Website" value={url} 
                                                    onChange={(e) => this.setState({url: e.target.value, isDirty: true})} />
                                            </FormControl>                                        
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    organization: state.organizations.currentOrganization || {},
    organizationLoading: state.organizations.organizationLoading,
    organizationLoaded: state.organizations.organizationLoaded,
    user: state.auth.user || {},
});

const mapDispatchToProps = {
    setTitle,
    saveOrganization,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(OrganizationDetail));