import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { MenuItem, Select } from '@mui/material';
import { withStyles } from '@mui/styles';

import { changeMonth } from '../../actions/navigation';

const styles = theme => ({
    monthSelect: {
        height: "2.5em",
        maxWidth: "16em",
    }
});

class MonthSelector extends React.Component {
    state = {
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
                    availableMonths.push({id: monthValue, label: monthLabel});
                } else if (monthValue.localeCompare(currentMonth) == 0) {
                    availableMonths.push({id: monthValue, label: monthLabel + " (current)"});
                  
                } else if (!this.props.hideFuture && monthValue.localeCompare(currentMonth) > 0) {
                    availableMonths.push({id: monthValue, label: monthLabel});
                }
            });
        });

        this.setState({availableMonths: availableMonths.reverse()});

        if (!selectedMonth) changeMonth(availableMonths.filter(m => m.id === currentMonth)[0].id);
    }

    changeMonth = (e) => {
        const { selectedMonth, changeMonth } = this.props;
        const { availableMonths } = this.state;

        let newMonth = availableMonths.filter(m => m.id === e.target.value)[0]
        
        if (newMonth && newMonth.id !== selectedMonth) changeMonth(newMonth.id);
    }

    render() {
        const { classes, selectedMonth, variant } = this.props;
        const { availableMonths } = this.state;

        return (
            <Select name="monthSelector" id="monthSelector" variant={variant || "outlined"} fullWidth={true}
                className={classes.monthSelect} value={availableMonths.length > 0 ? selectedMonth : ""} onChange={this.changeMonth}>
                    { availableMonths.map((month) => {
                            return (<MenuItem key={month.id} value={month.id}>{month.label}</MenuItem>);
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (MonthSelector));