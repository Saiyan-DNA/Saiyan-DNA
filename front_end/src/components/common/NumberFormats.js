import React from "react";
import NumberFormat from 'react-number-format';

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