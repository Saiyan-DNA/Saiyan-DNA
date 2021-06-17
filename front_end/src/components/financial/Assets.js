import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Layout" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Material" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Layout" */));
const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Material" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material" */));
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material" */));

import { CurrencyFormat } from '../common/NumberFormats';

import { createMessage } from '../../actions/messages';
import { getAssets, getAsset, clearAsset } from '../../actions/assets';
import { setTitle } from '../../actions/navigation';

const styles = theme => ({
    assetSummary: {
        margin: 0,
        padding: "2px",
        paddingTop: "8px",
        paddingBottom: "8px",
        ['@media print']: {
            paddingTop: "4px",
            paddingBottom: "4px"
        }
    },
    inlineGrid: {
        display: "inline-block",
    },
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    }
});

class AssetsList extends React.Component {
    constructor(props) {
        super(props);
        this.actionAddAsset = this.actionAddAsset.bind(this)
    }

    static propTypes = {
        assets: PropTypes.array.isRequired,
        getAssets: PropTypes.func.isRequired,
        getAsset: PropTypes.func.isRequired,
        clearAsset: PropTypes.func.isRequired,
        createMessage: PropTypes.func.isRequired,
        setTitle: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setTitle("Assets");
        this.props.getAssets();
    }

    actionAddAsset() {
        this.props.clearAsset();
        this.props.history.push("/financial/assetinfo");
    }

    viewAsset(id) {
        this.props.getAsset(id);
        this.props.history.push("/financial/assetinfo");
    }

    assetList(styleClasses) {
        const assets = this.props.assets
        const total = assets.reduce((cnt, asset) => cnt + asset.current_value, 0);

        return(
            <Card elevation={4}>
                <CardContent>
                    <Grid container spacing={0} justify={"space-between"} style={{paddingBottom: "8px"}}>
                        <Grid item>
                            <Typography variant="h5">Assets</Typography>
                        </Grid>
                        <Grid item xs={"auto"}>
                            <Typography variant="h5">
                                <CurrencyFormat value={total} displayType={'text'} />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                    <List>
                    { assets.map(asset => (
                        <div key={asset.id}>
                            <ListItem button onClick={() => {this.viewAsset(asset.id)}} className={styleClasses.accountSummary}>
                                <Grid container spacing={0} justify="space-between">
                                    <Grid item>
                                        <Typography variant="body1">{asset.name}</Typography>
                                    </Grid>
                                    <Grid item xs={"auto"}>
                                        <Typography variant="body1">
                                            <CurrencyFormat value={asset.current_value} displayType={'text'} />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption"
                                            style={{verticalAlign: "text-top", fontStyle: "italic"}}>{asset.asset_type}</Typography>
                                    </Grid>
                                </Grid>                                
                            </ListItem>
                            <Divider />
                        </div>                                
                    ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <Container>
                <Grid container spacing={2} >
                    <Grid item xs={12} align={"right"} mt={2} className={classes.hideForPrint}>
                        <Button variant={"contained"} color={"primary"} size="small" 
                            onClick={this.actionAddAccount}>Add Asset</Button>
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.inlineGrid}>
                        {this.assetList(classes)}
                    </Grid>                    
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    assets: state.assets.assets,
    message: state.message
});

export default connect(mapStateToProps, { getAssets, getAsset, clearAsset, createMessage, setTitle })(withStyles(styles, { withTheme: true })(AssetsList));