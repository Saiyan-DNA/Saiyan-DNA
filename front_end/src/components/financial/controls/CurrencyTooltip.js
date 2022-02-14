import React from 'react';
import loadable from "@loadable/component";

import { Typography } from '@mui/material';

const CurrencyFormat = loadable(() => import('../../common/CurrencyFormat' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

class CurrencyTooltip extends React.Component {
    render() {
        const { text, targetItem } = this.props;

        return (
            <>
                { targetItem.series === "defaultSeriesName" ? null :
                    <Typography variant="body1">{targetItem.series}</Typography>
                }
                <CurrencyFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} />
            </>
        );
    }
}

export default CurrencyTooltip;