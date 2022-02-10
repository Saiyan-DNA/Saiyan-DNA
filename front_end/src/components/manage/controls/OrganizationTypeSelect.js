import React from "react";

import { withStyles } from '@mui/styles';

import { MenuItem, TextField } from "@mui/material";

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    }
});

const OrganizationTypeSelect = ({variant, value, defaultValue, onChange, onBlur, className, showAllTypes=true, showLabel=true, disabled=false, required=false}) => {
    const orgTypes = [
        { value: "ALL", label: "All Types" }, 
        { value: "CTY", label: "Charity" },
        { value: "CRA", label: "Credit Reporting Agency"},
        { value: "EDU", label: "Educational" },
        { value: "FIN", label: "Financial" },
        { value: "GOV", label: "Government" },
        { value: "MED", label: "Medical" },
        { value: "OTH", label: "Other" },
        { value: "POL", label: "Political" },
        { value: "RLG", label: "Religious" },
        { value: "RST", label: "Restaurant" },
        { value: "RTL", label: "Retail" },
        { value: "SVC", label: "Service" }
    ];

    if (!showAllTypes) {
        orgTypes.splice(0, 1);
    }

    return (
        <TextField select label={showLabel ? "Organization Type" : null} variant={variant || "outlined"} size="small" id="orgType" name="orgType"
            className={className} fullWidth={true} value={value} defaultValue={defaultValue} placeholder="Organization Type"
            onChange={onChange} onBlur={onBlur} disabled={disabled} required={required}>
            {orgTypes.map(type => (
                <MenuItem key={type.value} value={type.value} className={className}>{type.label}</MenuItem>
            ))}
        </TextField>
    );
}

export default (withStyles(styles, { withTheme: true })(OrganizationTypeSelect));