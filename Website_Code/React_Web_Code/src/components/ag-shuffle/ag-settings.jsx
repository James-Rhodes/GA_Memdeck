import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Card, Form, Button, InputGroup, FloatingLabel } from "react-bootstrap";

export class AGSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minNumShuffles: 1,
      maxNumShuffles: 10,
      numFaros: -1,
      numCutDeck: -1,
      numPokerHands: -1,
      numOverhandShuffles: -1,
      numDealClumps: -1,
      iterations: 1,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShuffleParamChange = this.handleShuffleParamChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.changeSettings(this.state);
  }

  handleChange(e) {
    this.setState((prev) => {
      const newValue = parseInt(e.target.value);
      if (e.target.id === "maxNumShuffles") {
        if (newValue < prev.minNumShuffles) {
          return {
            ...prev,
            minNumShuffles: newValue,
            [e.target.id]: newValue,
          };
        }
      }

      return { ...prev, [e.target.id]: newValue };
    });
  }

  handleShuffleParamChange(identifier, value) {
    this.setState((prev) => {
      return {
        ...prev,
        [identifier]: value,
      };
    });
  }

  render() {
    return (
      <div>
        <Card>
          <Card.Body>
            <Card.Title>Card Shuffle Settings</Card.Title>

            <NumShufflesSettings
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
              handleShuffleParamChange={this.handleShuffleParamChange}
              params={this.state}
              buttonDisabled={this.props.buttonDisabled}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
}

function NumShufflesSettings(props) {
  return (
    <Form onSubmit={props.handleSubmit} id="settingsForm">
      <Form.Group
        className="mb-3 "
        controlId="maxNumShuffles"
        onChange={props.handleChange}
      >
        <Form.Label>
          Max Number of Shuffles: {props.params.maxNumShuffles}
        </Form.Label>
        <Form.Range max="10" min="1" />
      </Form.Group>

      <Form.Group
        className="mb-3"
        controlId="minNumShuffles"
        onChange={props.handleChange}
      >
        <Form.Label>
          Min Number of Shuffles: {props.params.minNumShuffles}
        </Form.Label>
        <Form.Range max={props.params.maxNumShuffles} min="1" />
      </Form.Group>

      <Form.Group
        className="mb-3"
        controlId="iterations"
        onChange={props.handleChange}
      >
        <Form.Label>Number of Iterations: {props.params.iterations}</Form.Label>
        <Form.Range max="3" min="1" />
      </Form.Group>

      {Object.entries(props.params).map(([keyName, value]) => {
        if (keyName[0] === "n") {
          return (
            <ShufflePropertiesSelect
              name={keyName
                .split(/(?=[A-Z])/)
                .slice(1)
                .join(" ")}
              // Removes num from key name and also splits the words by the capital letters in camelcase
              identifier={keyName}
              handleValueChange={props.handleShuffleParamChange}
              key={keyName}
            />
          );
        }
        return undefined;
      })}
      <Card.Text>
        *If the number of shuffles does not matter to you (ie. any amount of
        that type of shuffle is okay) check the checkbox next to the select bar.
      </Card.Text>
      <Button
        variant="secondary"
        type="submit"
        disabled={props.buttonDisabled !== undefined}
      >
        Generate Order
      </Button>
    </Form>
  );
}

function ShufflePropertiesSelect(props) {
  const [selectValue, setSelectValue] = useState(-1);
  const prevValueRef = useRef("Default");
  const { handleValueChange, name, identifier } = props;
  useEffect(() => {
    handleValueChange(identifier, selectValue);
  }, [selectValue, identifier, handleValueChange]);

  const change = (e) => {
    let data = e.target;
    setSelectValue((prev) => {
      if (data.id === "select") {
        const result = parseInt(data.value);
        if (prevValueRef.current === "Default") {
          // Bug below, if user changes any of the select boxes it only changes the first instance on the page
          document.getElementById(`checkbox_${name}`).checked = false;
        }
        prevValueRef.current = result;
        return result;
      } else if (data.id === `checkbox_${name}`) {
        if (data.checked) {
          // document.getElementById(`select_${name}`).value = "Default";
          return -1;
        } else {
          return prevValueRef.current === "Default" ? -1 : prevValueRef.current;
        }
      }
      return prevValueRef.current;
    });

    handleValueChange(identifier, selectValue);
  };
  return (
    <InputGroup className="mb-3" styles={{ width: "100%" }}>
      <FloatingLabel controlId="select" label={`Max Number of ${name}`}>
        <Form.Select
          aria-label="Floating label select example"
          size="lg"
          disabled={prevValueRef.current !== "Default" && selectValue === -1}
          value={selectValue === -1 ? "Default" : selectValue}
          onChange={change}
          style={{ height: "100%" }}
        >
          <option value={"Default"} disabled hidden>
            Choose Number of Shuffles
          </option>
          {[...Array(11)].map((x, i) => (
            <option key={10 - i} value={10 - i}>
              {10 - i}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
      <InputGroup.Checkbox
        aria-label="Checkbox for following text input"
        id={`checkbox_${name}`}
        defaultChecked={true}
        disabled={prevValueRef.current === "Default"}
        onChange={change}
      />
    </InputGroup>
  );
}
