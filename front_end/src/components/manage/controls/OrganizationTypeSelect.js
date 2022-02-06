import React from "react";
import loadable from '@loadable/component';

const FormControl = loadable(() => import('@material-ui/core/FormControl' /* webpackChunkName: "Material-Input" */));
const InputLabel = loadable(() => import('@material-ui/core/InputLabel' /* webpackChunkName: "Material-Input" */));
const MenuItem = loadable(() => import('@material-ui/core/MenuItem' /* webpackChunkName: "Material-Navigation" */));
const Select = loadable(() => import('@material-ui/core/Select' /* webpackChunkName: "Material-Input" */));

const OrganizationTypeSelect = ({variant, value, defaultValue, onChange, onBlur, className, showAllTypes=true, showLabel=true}) => {
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
        <FormControl fullWidth={true}>
            {showLabel && <InputLabel htmlFor="orgType">Type</InputLabel>}
            <Select variant={variant} size="small" id="orgType" name="orgType" className={className} fullWidth={true}
                value={value} defaultValue={defaultValue} onChange={onChange} onBlur={onBlur}>
                {orgTypes.map(type => (
                    <MenuItem key={type.value} value={type.value} className={className}>{type.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default OrganizationTypeSelect