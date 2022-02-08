import React from "react";
import loadable from '@loadable/component';

const NumberFormat = loadable(() => import('react-number-format' /* webpackChunkName: "General" */));

export const CurrencyFormat = React.forwardRef((props, ref) => {
  const { inputRef, onChange, decimalScale, ...other } = props;

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

export const PercentageFormat = React.forwardRef((props, ref) => {
    const { inputRef, onChange, decimalScale, ...other } = props;
  
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
        suffix="%"
      />
    );
  });