import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

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

export default connect(mapStateToProps, { setTitle, getHomes })(withStyles(styles, { withTheme: true })(HomeList));