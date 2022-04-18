import React from 'react';
import loadable from '@loadable/component';

const NumberFormat = loadable(() => import('react-number-format' /* webpackChunkName: "Common" */), {fallback: <span>&nbsp;</span>});

const CurrencyFormat = React.forwardRef((props, ref) => {
  const { inputRef, onChange, decimalScale, color, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      style={{"textAlign": "right"}}
      onValueChange={(values) => {!onChange ? null : 
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      onBlur={props.onBlur}
      decimalScale={decimalScale === null || decimalScale === "" || decimalScale === undefined ? 2 : decimalScale}
      fixedDecimalScale={true}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

export default CurrencyFormat;