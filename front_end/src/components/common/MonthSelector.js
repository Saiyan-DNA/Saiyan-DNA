import React from "react";
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const MenuItem = loadable(() => import('@mui/material/MenuItem' /* webpackChunkName: "Material-Navigation" */));
const Select = loadable(() => import('@mui/material/Select' /* webpackChunkName: "Material-Input" */));

import { changeMonth } from '../../actions/navigation';

const styles = theme => ({
    monthSelect: {
        maxHeight: "2.5em",
        maxWidth: "18em",
    }
});

class MonthSelector extends React.Component {
    state = {
        selectedMonth: "",
        availableMonths: []
    };

    static propTypes = {
        changeMonth: PropTypes.func.isRequired,
        selectedMonth: PropTypes.string.isRequired,
        variant: PropTypes.string,
        hideFuture: PropTypes.bool,
    }

    componentDidMount() {
        const { selectedMonth, changeMonth } = this.props;

        let years = [2019, 2020, 2021, 2022];
        let months = [
            {number: "01", label: "January"},   {number: "02", label: "February"},  {number: "03", label: "March"}, 
            {number: "04", label: "April"},     {number: "05", label: "May"},       {number: "06", label: "June"},
            {number: "07", label: "July"},      {number: "08", label: "August"},    {number: "09", label: "September"},
            {number: "10", label: "October"},   {number: "11", label: "November"},  {number: "12", label: "December"}
        ];
        
        let availableMonths = [];
        let today = new Date();
        let monthNumber = ("00" + (today.getMonth() + 1)).slice(-2);
        let currentMonth =  today.getFullYear() + "-" + monthNumber;

        years.map((year) => {
            months.map((month) => {
                let monthValue = `${year}-${month.number}`
                let monthLabel = `${month.label} ${year}`

                if (monthValue.localeCompare(currentMonth) < 0) {
                    availableMonths.push({value: monthValue, label: monthLabel});
                } else if (monthValue.localeCompare(currentMonth) == 0) {
                    availableMonths.push({value: monthValue, label: monthLabel + " (current)"});
                  
                } else if (!this.props.hideFuture && monthValue.localeCompare(currentMonth) > 0) {
                    availableMonths.push({value: monthValue, label: monthLabel});
                }
            });
        });

        availableMonths = availableMonths.reverse();

        this.setState({
            selectedMonth: selectedMonth || currentMonth,
            availableMonths: availableMonths
        });

        if (selectedMonth == "") {
            changeMonth(currentMonth);
        }

    }

    componentDidUpdate() {
        
    }

    changeMonth = (event) => {
        const { selectedMonth, changeMonth } = this.props;

        this.setState({selectedMonth: event.target.value});

        if (selectedMonth.localeCompare(event.target.value) != 0) {
            changeMonth(event.target.value);
        }

    }

    render() {
        const { classes, variant } = this.props;
        
        const { selectedMonth, availableMonths } = this.state;

        return (
            <Select name="monthSelector" id="monthSelector" variant={variant || "outlined"} fullWidth={true}
                className={classes.monthSelect} value={selectedMonth} onChange={this.changeMonth}>
                    { availableMonths.map((month) => {
                            return (
                                <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                            );
                        })
                    }
            </Select>
        );
    }
}

const mapStateToProps = state => ({
    selectedMonth: state.navigation.selectedMonth,
});

const mapDispatchToProps = {
    changeMonth,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (MonthSelector)));