import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import "./NumberInputStyle.css";

const blueColor = "numericInputStyle-blue";
const redColor = "numericInputStyle-red";

export const IntegerNumberInput = React.forwardRef((props, ref) => {
  const { min, max } = props;
  const [theme, setTheme] = useState(blueColor);
  const [shake, setShake] = useState("");

  const formatInput = (input) => {
    let result = input;
    // Below states that if the min<0 then match the pattern containing an optional - followed by between 0 and 2 numbers otherwise just match the numbers
    const regExpression =
      min < 0 ? result.match(/^[-]?[0-9]{0,2}/) : result.match(/^[0-9]{0,2}/);
    result = regExpression ? regExpression[0] : "";
    return result;
  };

  const isOutsideBounds = (numberString) => {
    if (numberString) {
      const isOnlyMinusSymbol =
        numberString.charAt(0) === "-" && numberString.length === 1;
      const isEmpty = numberString.length === 0;
      if (isOnlyMinusSymbol || isEmpty) {
        return false;
      }
      const result = parseInt(numberString);

      if (result > max || result < min) {
        return true;
      }
    }
    return false;
  };

  const clampToMaxMin = (num) => {
    return Math.min(Math.max(num, min), max);
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formattedInput = formatInput(input);
    setTheme(isOutsideBounds(formattedInput) ? redColor : blueColor);
    e.target.value = formattedInput;
    const returnObject = { id: e.target.id, value: formattedInput };
    if (props.onChange) {
      props.onChange(returnObject);
    }
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      return;
    }

    const result = clampToMaxMin(parseInt(e.target.value));
    if (result !== parseInt(e.target.value)) {
      setShake("shake");
    }
    e.target.value = result;

    setTheme(blueColor);
    const returnObject = { id: e.target.id, value: result };
    if (props.onChange && !props.onBlur) {
      props.onChange(returnObject);
    } else if (props.onBlur) {
      props.onBlur(returnObject);
    }
  };

  return (
    <>
      <input
        type="text"
        onChange={handleChange}
        id={props.id}
        onBlur={handleBlur}
        className={`${theme} numericInputStyle ${shake}`}
        onAnimationEnd={() => setShake("")}
        ref={ref}
      />
    </>
  );
});
