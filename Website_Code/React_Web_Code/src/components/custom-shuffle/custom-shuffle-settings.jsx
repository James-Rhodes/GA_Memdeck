import React, { useState, useRef, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { IntegerNumberInput } from "../NumberInput/NumberInput";
import { MultipleNumberInput } from "./../MultipleNumberInput/MultipleNumberInput";
import { Button } from "react-bootstrap";

const typesOfShuffles = {
  "Faro Shuffle": <FaroShuffle />,
  "Cut Deck": <CutDeck />,
  "Deal Poker Hands": <DealPokerHands />,
  "Overhand Shuffle": <OverhandShuffle />,
  "Dealing In Clumps": <DealingInClumps />,
};

const optionsContainerStyle = {
  borderLeft: "5px solid rgba(13, 110, 253, 0.3)",
  borderBottom: "5px solid rgba(13, 110, 253, 0.3)",
  marginLeft: "2em",
  marginBottom: "1em",
  padding: "1em 0.2em 0.2em 1em",
  borderRadius: "0em 0em 0em 1em",
};

const textStyle = { display: "inline-block", marginRight: "0.5em" };

export function CustomShuffleSettings(props) {
  const [numShuffles, setNumShuffles] = useState(5);
  const [allShufflesSelected, setAllShufflesSelected] = useState(false);
  const shuffleSettings = useRef(Array(5).fill(undefined));

  useEffect(() => {
    setAllShufflesSelected(checkAllSettingsValid());
  }, [numShuffles]);

  const handleNumShufflesChange = (e) => {
    setNumShuffles((prev) => {
      const newNumShuffles = parseInt(e.target.value);
      const shuffs = shuffleSettings.current;
      if (prev < newNumShuffles) {
        shuffleSettings.current = [
          ...shuffs,
          ...Array(Math.max(newNumShuffles - shuffs.length, 0)).fill(undefined),
        ];
      } else if (prev > newNumShuffles) {
        shuffleSettings.current = shuffs.slice(0, newNumShuffles);
      }
      return newNumShuffles;
    });
  };

  const checkAllSettingsValid = () => {
    for (let obj of shuffleSettings.current) {
      if (!obj) {
        return false;
      }
      if (!obj.type || !obj.params) {
        return false;
      }
    }
    return true;
  };

  const handleSettingsChange = (e) => {
    const { params, type, pos } = e;
    shuffleSettings.current[pos] = { params, type };
    setAllShufflesSelected(checkAllSettingsValid());
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>Card Shuffle Settings</Card.Title>

          <Form.Label>Max Number of Shuffles: {numShuffles}</Form.Label>
          <Form.Range
            onChange={handleNumShufflesChange}
            min={1}
            max={10}
          ></Form.Range>

          {[...Array(numShuffles)].map((el, idx) => {
            return (
              <ShuffleOptions
                key={idx}
                position={idx}
                handleSettingsChange={handleSettingsChange}
              />
            );
          })}
          <Button
            variant="secondary"
            onClick={() => {
              props.onSubmit(shuffleSettings.current);
            }}
            disabled={!allShufflesSelected}
          >
            Generate Order
          </Button>
          {!allShufflesSelected && (
            <p style={{ color: "red" }}>
              *Please ensure that all shuffles have been selected*
            </p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

function ShuffleOptions(props) {
  const [shuffleType, setShuffleType] = useState("Default");
  const handleChange = (e) => {
    const shuffleInfo = { type: shuffleType, ...e, pos: props.position };
    props.handleSettingsChange(shuffleInfo);
  };
  return (
    <div>
      <Form.Select
        value={shuffleType}
        onChange={(e) => {
          setShuffleType(e.target.value);
        }}
        style={
          shuffleType === "Default" || shuffleType === "Faro Shuffle"
            ? { marginBottom: "1em" }
            : {}
        }
      >
        <option value={"Default"} disabled hidden>
          Choose Shuffle
        </option>
        {Object.keys(typesOfShuffles).map((el) => {
          return (
            <option value={el} key={el}>
              {el}
            </option>
          );
        })}
      </Form.Select>

      {typesOfShuffles[shuffleType] &&
        React.cloneElement(typesOfShuffles[shuffleType], {
          handleChange: handleChange,
        })}
    </div>
  );
}

function FaroShuffle(props) {
  useEffect(() => {
    props.handleChange({ params: [] });
  }, []);

  return <></>;
}

function CutDeck(props) {
  const handleBlur = ({ value }) => {
    props.handleChange({ params: [value] });
  };

  return (
    <div style={optionsContainerStyle}>
      <p style={textStyle}>
        Choose a position to cut the deck at from the top of the deck (number
        between 0-52):
      </p>
      <IntegerNumberInput
        id={"CutDeckPos"}
        min={0}
        max={52}
        onBlur={handleBlur}
      />
    </div>
  );
}

function DealPokerHands(props) {
  const numDealsRef = useRef(undefined);
  const cardsPerDealRef = useRef(undefined);

  const handleBlur = (e) => {
    const numDeals = parseInt(numDealsRef.current.value);
    const cardsPerDeal = parseInt(cardsPerDealRef.current.value);
    props.handleChange({ params: [numDeals, cardsPerDeal] });
  };
  return (
    <div style={optionsContainerStyle}>
      <div>
        <p style={textStyle}>Number of Hands (max 8): </p>
        <IntegerNumberInput
          id={"numDeals"}
          min={0}
          max={8}
          onBlur={handleBlur}
          ref={numDealsRef}
        />
      </div>
      <div>
        <p style={textStyle}>Cards Per Hand (max 5): </p>
        <IntegerNumberInput
          id={"cardsPerDeal"}
          min={0}
          max={5}
          onBlur={handleBlur}
          ref={cardsPerDealRef}
        />
      </div>
    </div>
  );
}

function OverhandShuffle(props) {
  const handleBlur = (e) => {
    const params = e.value;
    props.handleChange({ params });
  };

  return (
    <div style={optionsContainerStyle}>
      <p style={textStyle}>
        List the number of cards to run off the top of the deck with a space in
        between* (max = 5 shuffles):
      </p>
      <MultipleNumberInput
        id={"overhandShuffleShuffles"}
        min={0}
        max={10}
        maxNumberOfValues={5}
        onBlur={handleBlur}
      />
      <p>
        eg. 1 2 3 would be equivalent to running 1 card off the top of the deck
        and depositing the rest on top followed by repeating for 2 cards then 3.
      </p>
    </div>
  );
}

function DealingInClumps(props) {
  const handleBlur = (e) => {
    const params = e.value;
    props.handleChange({ params });
  };

  return (
    <div style={optionsContainerStyle}>
      <p style={textStyle}>
        List the clumps to deal off the top of the deck with a space in between*
        (max = 5 deals):
      </p>
      <MultipleNumberInput
        id={"DealingInClumps"}
        min={0}
        max={10}
        maxNumberOfValues={5}
        onBlur={handleBlur}
      />
      <p>
        eg. 1 2 3 would be equivalent to dealing 1 card followed by 2 cards then
        3 followed by the rest of the deck on top.
      </p>
    </div>
  );
}
