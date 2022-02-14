import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { Divider, Grid, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const CurrencyFormat = loadable(() => import('../../common/CurrencyFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const InfoTile = loadable(() => import('../../common/InfoTile' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});
const SummaryCard = loadable(() => import('../../common/SummaryCard' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

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

class DebtIncomePanel extends React.Component {
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
            <SummaryCard headerTitle="Debt-to-Income">
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (DebtIncomePanel));