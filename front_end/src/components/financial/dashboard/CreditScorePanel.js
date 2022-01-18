import React from "react";
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Material-Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Material-Layout" */));
const Divider = loadable(() => import('@material-ui/core/Divider' /* webpackChunkName: "Material" */));

import { CurrencyFormat } from '../../common/NumberFormats'

// const LoadingMessage = loadable(() => import('../common/LoadingMessage' /* webpackChunkName: "Layout" */), {fallback: <div>&nbsp;</div>});
const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "General" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Layout" */), {fallback: <span>&nbsp;</span>});

import { Chart, PieSeries, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, Palette } from '@devexpress/dx-react-chart';


const styles = theme => ({
    listCard: {
        backgroundColor: theme.palette.primary.main
    },
    listCardHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(1,1,1),
        ['@media print']: {
            backgroundColor: "inherit",
            color: "inherit",
            borderBottom: "0.5px solid #DCDCDC"
        }
    },
    listCardContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(0,1,0)
    },
    transactionSummary: {
        margin: 0,
        padding: "2px",
        paddingTop: "8px",
        paddingBottom: "8px",
        borderBottom: "0.5px solid #DCDCDC",
        ['@media print']: {
            paddingTop: "4px",
            paddingBottom: "4px"
        }
    },
    emptyMessage: {
        textAlign: "center",
        fontStyle: "italic",
        marginTop: "12px",
        marginBottom: "12px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    numberFormat: {
        textAlign: "right"
    },
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    },
    listCaption: {
        verticalAlign: "text-top", 
        fontStyle: "italic",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
});

function currencyTooltip(props) {
    const { text, targetItem } = props;

    return (
        <>
            {targetItem.series === "defaultSeriesName" ? null :
                <Typography variant="body1">{targetItem.series}</Typography>
        }
            <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} />
        </>
    );
}

class CreditScorePanel extends React.Component {
    state = {

    };

    static propTypes = {
        
    }

    componentDidMount() {
        
    }

    componentDidUpdate() {
        
    }

    render() {
        const { ...otherProps } = this.props;
        
        return (
            <SummaryCard header="Credit Score">
                <Grid container spacing={2} justifyContent={"center"}>
                </Grid>
            </SummaryCard>
        );
    }
}

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = {
    
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (CreditScorePanel)));