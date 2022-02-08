import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Button = loadable(() => import('@mui/material/Button' /* webpackChunkName: "Material-Navigation" */));
const Card = loadable(() => import('@mui/material/Card' /* webpackChunkName: "Material-Layout" */));
const CardContent = loadable(() => import('@mui/material/CardContent' /* webpackChunkName: "Material-Layout" */));
const Container = loadable(() => import('@mui/material/Container' /* webpackChunkName: "Material-Layout" */));
const List = loadable(() => import('@mui/material/List' /* webpackChunkName: "Material-Layout" */));

import { setTitle } from '../../actions/navigation';

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    }
});

class PeopleList extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        setTitle: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.setTitle("People");
    }

    render() {
        const { classes } = this.props;

        return(
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} align="right" className={classes.hideForPrint}>
                        <Button variant="contained" color="primary" size="small">Add Person</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card elevation={4}>
                            <CardContent>
                                <List>

                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { setTitle })(withStyles(styles, { withTheme: true })(PeopleList));