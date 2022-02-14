import React from 'react';

import { LinearProgress, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const styles = theme => ({
    passwordStrengthMeter: { marginTop: "5px" }
});

class PasswordStrengthMeter extends React.Component {

    transformScore = score => {

        return {
            normalizedValue: (score+1 - 0) * 100 / (5 - 0),
            label: score == 4 ? "Strong" : score == 3 ? "Good" : score == 2 ? "Fair" : score == 1 ? "Weak" : "Weakest",
            colorType: score == 0 ? "error" : score < 3 ? "warning" : "success"
        };

    }
    
    render() {
        const { classes, score } = this.props;
        const transformedResult = this.transformScore(score);

        return (
            <div className={classes.passwordStrengthMeter}>
                <LinearProgress variant="determinate" value={transformedResult.normalizedValue} color={transformedResult.colorType} />
                <Typography variant="caption" className={classes.strengthLabel}>{transformedResult.label}</Typography>
            </div>
        )
    }
}


export default withStyles(styles, {withTheme: true})(PasswordStrengthMeter);