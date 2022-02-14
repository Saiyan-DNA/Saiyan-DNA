import React from 'react';
import PropTypes from 'prop-types';

import { Card, Grid, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const styles = theme => ({
    infoTileCard: {
        padding: "0em"
    },
    infoTitle: {},
    infoContent: {},
    infoCaption: {
        fontStyle: "italic"        
    }
});

class InfoTile extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        content: PropTypes.any.isRequired,
        caption: PropTypes.any
    }

    render() {
        const { title, content, caption, classes, showBorder } = this.props;

        return (
            <Card variant={showBorder ? "outlined" : "elevation"} elevation={0} className={classes.infoTileCard}>
                <Grid container direction="column" spacing={0} justifyContent={"center"} alignContent="center" style={{marginTop: "2px"}}>
                    <Grid item>
                        <Typography variant="h5" align="center" className={classes.infoTitle}>{content}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" align="center" className={classes.infoContent}>{title}</Typography>
                    </Grid>
                    {!caption ? null :
                        <Grid item>
                            <Typography variant="caption" align="center" className={classes.infoCaption}>{caption}</Typography>
                        </Grid>
                    }
                </Grid>
            </Card>
        );
    }
}

export default withStyles(styles, {withTheme: true})(InfoTile);