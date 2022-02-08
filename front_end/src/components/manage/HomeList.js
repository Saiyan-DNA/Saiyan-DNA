import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const Grid = loadable(() => import('@mui/material/Grid' /* webpackChunkName: "Material-Layout" */));

const Button = loadable(() => import('@mui/material/Button' /* webpackChunkName: "Material-Navigation" */));
const Card = loadable(() => import('@mui/material/Card' /* webpackChunkName: "Material-Layout" */));
const CardContent = loadable(() => import('@mui/material/CardContent' /* webpackChunkName: "Material-Layout" */));
const Container = loadable(() => import('@mui/material/Container' /* webpackChunkName: "Material-Layout" */));
const List = loadable(() => import('@mui/material/List' /* webpackChunkName: "Material-Layout" */));
const ListItem = loadable(() => import('@mui/material/ListItem' /* webpackChunkName: "Material-Layout" */));
const ListItemText = loadable(() => import('@mui/material/ListItemText' /* webpackChunkName: "Material-Layout" */));

import { setTitle } from '../../actions/navigation';
import { getHomes } from '../../actions/homes';

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    }
});

class HomeList extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        setTitle: PropTypes.func.isRequired,
        getHomes: PropTypes.func.isRequired,
        homes: PropTypes.array.isRequired,
    }

    componentDidMount() {
        this.props.setTitle("Homes");
        this.props.getHomes();
    }

    render() {
        const { classes } = this.props;

        return(
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} align="right" className={classes.hideForPrint}>
                        <Button variant="contained" color="primary" size="small">Add Home</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card elevation={4}>
                            <CardContent>
                                <List>
                                    {this.props.homes.map(home => (
                                        <ListItem key={home.id} button divider onClick={() => {console.log(`Edit '${home.name}'`)}}>
                                            <ListItemText primary={home.name} />
                                        </ListItem>
                                    ))}
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
    homes: state.homes.homes || [],
});

const mapDispatchToProps = {
    setTitle,
    getHomes
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(HomeList));