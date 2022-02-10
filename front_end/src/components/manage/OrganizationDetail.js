import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

import { Box, Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material';

import { setTitle } from '../../actions/navigation';
import { saveOrganization, deleteOrganization } from '../../actions/organizations';

const BasicModal = loadable(() => import('../common/BasicModal' /* webpackChunkName: "Common" */));
const DestructiveButton = loadable(() => import('../common/DestructiveButton' /* webpackChunkName: "Common" */));
const OrganizationTypeSelect = loadable(() => import('./controls/OrganizationTypeSelect' /* webpackChunkName: "Manage" */));

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    },
    modalMessageIndented: {
        marginLeft: "2em",
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
        readOnly: false,
        deleteModalOpen: false,
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
        const { organization, setTitle } = this.props;

        setTitle(organization.name || "New Organization");
    }

    componentDidUpdate() {
        const { organization, setTitle, user } = this.props;
        const { id } = this.state;

        if (organization.id && id !== organization.id) {
            setTitle(organization.name);

            this.setState({
                id: organization.id,
                name: organization.name,
                organizationType: organization.organization_type.value || "",
                url: organization.website_url || "",
                isDirty: false,
                readOnly: !(organization.created_by && organization.created_by.id === user.id)
            });
        }
    }

    saveOrganization = () => {
        const { id, name, organizationType, url } = this.state;
        const { history, user, saveOrganization } = this.props;

        saveOrganization({
            id: id, 
            name: name, 
            organization_type: organizationType,
            website_url: url,
            created_by: user.id
        });

        this.setState({isDirty: false});

        setTimeout(() => {history.goBack()}, 500);
    }
    
    actionDeleteOrganization = () => {
        const { id } = this.state;
        const { history, deleteOrganization } = this.props;

        deleteOrganization(id);
        setTimeout(() => {history.goBack()}, 500);
    }

    toggleDeleteModal = () => {
        this.setState({deleteModalOpen: !this.state.deleteModalOpen});
    }

    deleteModal = () => {
        const { name, deleteModalOpen } = this.state;
        const { classes } = this.props;

        return (
            <BasicModal open={deleteModalOpen} onClose={this.toggleDeleteModal} title="Delete Organization?">
                <div className={classes.modalMessage}>
                    <Typography variant="body1">Are you sure you want to delete this organization?</Typography>
                </div>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                        <Button variant="outlined" color="primary" size="small" onClick={this.toggleDeleteModal}>Cancel</Button>
                    </Grid>
                    <Grid item>
                        <DestructiveButton onClick={this.actionDeleteOrganization}>Delete</DestructiveButton>
                    </Grid>
                </Grid>
            </BasicModal>
        )
    }

    render() {
        const { classes } = this.props;
        const { id, name, organizationType, url, isDirty, readOnly } = this.state;      

        return(
            <Container>
                <Box component="form" autoComplete="off">
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs={6} align="left" className={classes.hideForPrint}>
                            <Button variant="outlined" color="primary" size="small" onClick={() => {this.props.history.goBack()}}>Back</Button>
                        </Grid>
                        <Grid item xs={6} align="right" className={classes.hideForPrint}>
                            <Button variant="contained" color="primary" size="small" disabled={!isDirty || readOnly} onClick={this.saveOrganization}>
                                {id ? "Save" : "Add"}</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Grid container spacing={2} justifyContent="space-between">
                                        <Grid item xs={12} md={6}>
                                            <TextField id="name" name="name" label="Organization Name" required value={name} 
                                                disabled={readOnly} variant="standard" fullWidth={true}
                                                onChange={(e) => this.setState({name: e.target.value, isDirty: true})} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <OrganizationTypeSelect required value={organizationType} showAllTypes={false} disabled={readOnly}
                                                variant="standard" onChange={(e) => this.setState({organizationType: e.target.value, isDirty: true})} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField id="url" name="url" label="Website" variant="standard" fullWidth={true}
                                                value={url} disabled={readOnly} onChange={(e) => this.setState({url: e.target.value, isDirty: true})} />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        { id && !readOnly &&
                            <Grid item xs={12}>
                                <DestructiveButton onClick={this.toggleDeleteModal}>Delete</DestructiveButton>
                            </Grid>
                        }
                    </Grid>
                </Box>
                { this.deleteModal() }
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
    deleteOrganization,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(OrganizationDetail));