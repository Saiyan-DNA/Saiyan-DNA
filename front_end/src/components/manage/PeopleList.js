import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Material" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Material" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material" */));

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