import React from "react";
import loadable from '@loadable/component';

const NumberFormat = loadable(() => import('react-number-format' /* webpackChunkName: "General" */));

export const CurrencyFormat = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      style={{"textAlign": "right"}}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      onClick={(e) => {
          e.target.select();
      }}
      onBlur={props.onBlur}
      decimalScale={2}
      fixedDecimalScale={true}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

export const PercentageFormat = (props) => {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        style={{"textAlign": "right"}}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        onClick={(e) => {
            e.target.select();
        }}
        onBlur={props.onBlur}
        decimalScale={2}
        fixedDecimalScale={true}
        thousandSeparator
        isNumericString
        suffix="%"
      />
    );
  }