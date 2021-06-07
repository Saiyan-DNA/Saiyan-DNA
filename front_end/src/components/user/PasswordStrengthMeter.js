import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    passwordStrengthMeter: {
        marginTop: "5px"
    },
    weakestColor: {
        backgroundColor: "#F25F5C"        
    },
    weakColor: {
        backgroundColor: "#ff9900"
    },
    fairColor: {
        backgroundColor: "#FFE066"
    },
    goodColor: {
        backgroundColor: "#70C1B3"
    },
    strongColor: {
        backgroundColor: "#70C1B3"
    }
});

class PasswordStrengthMeter extends React.Component {

    transformScore = score => {
        var normalizedValue = (score+1 - 0) * 100 / (5 - 0);
        var strengthLabel = "";
        
        switch (score) {
            case 0:
                strengthLabel = "Weakest";
                break;
            case 1:
                strengthLabel = "Weak";
                break;
            case 2:
                strengthLabel = "Fair";
                break;
            case 3:
                strengthLabel = "Good";
                break;
            case 4:
                strengthLabel = "Strong";
                break;
            default:
                strengthLabel = "Weakest";
        }

        return {
            normalizedValue: normalizedValue,
            label: strengthLabel,
            colorClass: strengthLabel.toLowerCase() + "Color"
        };

    }
    
    render() {
        const { classes, score } = this.props;
        const transformedResult = this.transformScore(score);

        return (
            <div className={classes.passwordStrengthMeter}>
                <LinearProgress variant="determinate" value={transformedResult.normalizedValue} 
                    classes={{barColorPrimary: classes[transformedResult.colorClass]}}/>
                <Typography variant="caption" className={classes.strengthLabel}>{transformedResult.label}</Typography>
            </div>
        )
    }
}


export default withStyles(styles, {withTheme: true})(PasswordStrengthMeter);