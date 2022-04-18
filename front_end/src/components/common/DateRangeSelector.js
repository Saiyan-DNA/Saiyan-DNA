import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, TextField, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import enLocale from 'date-fns/locale/en-US';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { changeDateRange } from '../../actions/navigation';
import { addDays } from '../../utils/dateutils';

const styles = theme => ({
    dateSelect: {
        height: "1.5em",
        maxWidth: "16em",
    }
});

class DateRangeSelector extends React.Component {
    state = {
        startDate: null,
        endDate: null
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        changeDateRange: PropTypes.func.isRequired,
        startDate: PropTypes.object.isRequired,
        endDate: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.setState({
            startDate: this.props.startDate,
            endDate: this.props.endDate
        })
    }
    
    changeDate = async (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });        
    }

    onChange = (event) => {
        this.changeDate(event).then(() => {
            const { startDate, endDate } = this.state;
            this.props.changeDateRange(startDate, endDate);            
        })
    }

    render() {
        const { classes } = this.props;
        const { startDate, endDate } = this.state;


        if (startDate && endDate) {
            return (
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <Grid container spacing={1} justifyContent="center" textAlign="center">
                        <Grid item xs>
                            <DatePicker id="startDate" name="startDate" label="Start Date" 
                                onChange={(value) => this.onChange({target: {name: "startDate", value: value}})}
                                value={startDate} fullWidt={true} maxDate={endDate}
                                renderInput={(params) => <TextField {...params} fullWidth={true} size="small" variant="outlined" />} />
                        </Grid>
                        <Grid item container xs={"auto"} direction="column" justifyContent="center">
                            <Grid item>
                                <Typography variant="caption">to</Typography>
                            </Grid>                            
                        </Grid>
                        <Grid item xs>
                            <DatePicker id="endDate" name="endDate" label="End Date" 
                                onChange={(value) => this.onChange({target: {name: "endDate", value: value}})}
                                value={endDate} fullWidth={true} minDate={startDate}
                                renderInput={(params) => <TextField {...params} fullWidth={true} size="small" variant="outlined" />} />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            )
        }

        return (<div>&nbsp;</div>)
    }
}

const mapStateToProps = state => ({
    startDate: state.navigation.selectedStartDate,
    endDate: state.navigation.selectedEndDate
});

const mapDispatchToProps = {
    changeDateRange,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (DateRangeSelector));