import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Autocomplete, Grid, IconButton, TextField } from '@mui/material';

const AddIcon = loadable(() => import('@mui/icons-material/AddSharp' /* webpackChunkName: "Icons" */), {fallback: <div>&nbsp;</div>});

import { getOrganizations } from '../../actions/organizations';

class OrganizationSelect extends React.Component {
    static propTypes = {
        organizations: PropTypes.array.isRequired,
        organizationsLoading: PropTypes.bool.isRequired,
        organizationsLoaded: PropTypes.bool.isRequired,
        getOrganizations: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        id: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,
        variant: PropTypes.string,
        required: PropTypes.bool,
        allowAdd: PropTypes.bool,
        selection: PropTypes.object,        
        onChange: PropTypes.func,
        onBlur: PropTypes.func          
    }

    componentDidMount() {
        const { organizationsLoading, organizationsLoaded, getOrganizations } = this.props;
        if (!organizationsLoading && !organizationsLoaded) getOrganizations();
    }

    organizationSelected = (option, value) => {
        if (option.id == value.id) {
            return true
        }
        return false;
    }

    render() {
        const { id, name, label, organizations, onChange, onBlur, selection, required, typeFilter, variant, allowAdd, history } = this.props;

        var filteredOrganizations = !typeFilter ? organizations : organizations.filter(org => org.organization_type.label === typeFilter);

        if ( Autocomplete && TextField) {
            return (
                <Grid container spacing={0} alignItems="flex-end">
                    <Grid item xs>
                        <Autocomplete id={id} name={name}
                            options={filteredOrganizations ? filteredOrganizations.sort((a, b) => a.name.localeCompare(b.name)) : []}
                            getOptionLabel={(option) => option.name} isOptionEqualToValue={(option, value) => this.organizationSelected(option, value)}
                            value={selection} onBlur={onBlur} onChange={onChange} fullWidth={true} 
                            renderInput={(params) => <TextField {...params} label={label || "Organization"} variant={variant || "standard"} required={required} />}>
                        </Autocomplete>
                    </Grid>
                    {allowAdd && 
                        <Grid item xs={"auto"}>
                            <IconButton aria-label="add" onClick={() => history.push("/manage/organizationdetail")} size="small" variant="outlined" color="success">
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    }
                </Grid>
            )
        }

        return <div>&nbsp;</div>
    }
}

const mapStateToProps = state => ({
    organizations: state.organizations.organizations || [],
    organizationsLoading: state.organizations.organizationsLoading,
    organizationsLoaded: state.organizations.organizationsLoaded,
});

export default connect(mapStateToProps, { getOrganizations })(OrganizationSelect);