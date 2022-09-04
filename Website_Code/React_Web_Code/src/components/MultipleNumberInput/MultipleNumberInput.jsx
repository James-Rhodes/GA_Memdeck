import React from "react";
import { useState } from "react";
import "./MultipleNumberInputStyle.css";

const blueColor = "multipleNumberInput-blue";
const redColor = "multipleNumberInput-red";

export const MultipleNumberInput = React.forwardRef((props, ref) => {
  const { min, max, maxNumberOfValues } = props;
  const [theme, setTheme] = useState(blueColor);
  const [shake, setShake] = useState("");

  const formatSingleInput = (input) => {
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

    const formattedInputArray = input.split(/\s+/).slice(0, maxNumberOfValues);
    let themeChangedToRed = false;

    for (let i = 0; i < formattedInputArray.length; i++) {
      formattedInputArray[i] = formatSingleInput(formattedInputArray[i]);
      if (!themeChangedToRed) {
        themeChangedToRed = isOutsideBounds(formattedInputArray[i]);
      }
    }
    setTheme(themeChangedToRed ? redColor : blueColor);
    e.target.value = formattedInputArray.join(" ");
    const returnObject = { id: e.target.id, value: formattedInputArray };
    if (props.onChange) {
      props.onChange(returnObject);
    }
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      return;
    }
    let result = e.target.value.trim().split(/\s+/);
    let willShake = false;
    result = result.map((el) => {
      const clampedValue = clampToMaxMin(parseInt(el));
      if (!willShake) {
        willShake = clampedValue !== parseInt(el);
      }

      return clampedValue;
    });
    e.target.value = result.join(" ");
    setShake((prev) => (willShake ? "shake" : prev));
    setTheme(blueColor);

    const returnObject = { id: e.target.id, value: result };
    if (props.onChange && !props.onBlur) {
      props.onChange(returnObject);
    } else if (props.onBlur) {
      props.onBlur(returnObject);
    }
  };
  return (
    <input
      type="text"
      className={`multipleNumberInput ${theme} ${shake}`}
      onChange={handleChange}
      id={props.id}
      onBlur={handleBlur}
      onAnimationEnd={() => setShake("")}
      ref={ref}
    />
  );
});
