import React from "react";
import "../../styles/loader.css";

const h2Styles = { marginBottom: 0, fontSize: "18px" };
const pStyle = { marginBottom: 0 };
const outerLIStyle = { marginBottom: 5 };

export function DisplayResults(props) {
  // Displays the shuffles and the order of the deck
  const { shuffles, order, error, loading } = props;
  if (shuffles && order) {
    return (
      <div>
        <DisplayShuffles shuffles={props.shuffles} />
        <DisplayDeckOrder order={props.order} />
      </div>
    );
  } else if (error) {
    return <p>{props.error}</p>;
  } else if (loading) {
    return <LoadingDisplay />;
  } else {
    return <DefaultDisplay />;
  }
}

function DisplayShuffles(props) {
  const shuffles = props.shuffles;
  return (
    <div>
      <h2 style={h2Styles}>Shuffles:</h2>
      <ol>
        {shuffles.map((shuf, idx) => {
          return (
            <DisplaySingleShuffle shuffle={shuf} key={shuf.Type + "_" + idx} />
          );
        })}
      </ol>
    </div>
  );
}

function DisplaySingleShuffle(props) {
  const shuffle = props.shuffle;

  return (
    <li style={outerLIStyle}>
      <p style={pStyle}>{shuffle.Type}</p>
      <ul style={{ listStyle: "disc" }}>
        {Object.entries(shuffle).map(([key, value], idx) => {
          if (key === "Type") {
            return undefined;
          }
          const paramTitle = key.replace(/([a-z])([A-Z])/g, "$1 $2");
          const params = Array.isArray(value) ? value.join(", ") : value;
          return (
            <li key={key + "_" + idx}>
              {paramTitle}: {params}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function DisplayDeckOrder(props) {
  const order = props.order.split(",");

  const emojis = {
    spades: "0x2660",
    diamonds: "0x2666",
    clubs: "0x2663",
    hearts: "0x2665",
  };

  const colourOrder = (_, idx, arr) => {
    const card = arr[arr.length - 1 - idx]; // goes backwards through the array to give the order on a face down deck
    const suit = card.slice(-1);
    const value = card.slice(0, -1);
    if (suit === "H" || suit === "D") {
      return (
        <span style={{ color: "red" }} key={card}>
          {value +
            String.fromCodePoint(
              suit === "H" ? emojis.hearts : emojis.diamonds
            ) +
            " "}
        </span>
      );
    } else {
      return (
        <span key={card}>
          {value +
            String.fromCodePoint(suit === "S" ? emojis.spades : emojis.clubs) +
            " "}
        </span>
      );
    }
  };

  return (
    <div>
      <h2 style={h2Styles}>Order (from top of face down deck): </h2>
      <p>{order.map(colourOrder)}</p>
    </div>
  );
}

function DefaultDisplay(props) {
  return (
    <div>
      {/* <h2>Instructions:</h2> */}
      <p>
        Welcome to the automatic memorized deck generator! This website can be
        used to generate a seemingly random order for a deck of cards as well as
        the shuffles needed to take that order back to new deck order. There are
        a number of parameters that can be varied to alter the performance of
        the deck generation. A list of these parameters as well as what they do
        can be found below!
      </p>
      <ul>
        <li>
          Max number of shuffles: This is the maximum number of shuffles the
          algorithm will create a stack with
        </li>
        <li>
          Min number of shuffles: This is the minimum number of shuffles the
          algorithm will create a stack with
        </li>
        <li>
          Number of iterations: This is how many chances you give the algorithm
          to optimise the deck based on metrics such as randomness (this is
          subjective and based on the algorithm I provided to determine how
          random the order is) and minimising the number of shuffles used
        </li>
        <li>
          Max number of Faro shuffles: This is the maximum number of Faro
          shuffles you want the algorithm to tolerate within the shuffles
        </li>
        <li>
          Max number of cut decks: This is the maximum number of deck cuts you
          want the algorithm to tolerate within the shuffles
        </li>
        <li>
          Max number of deal piles: This is the maximum number of poker deals
          you want the algorithm to tolerate within the shuffles
        </li>
        <li>
          Max number of overhand shuffles: This is the maximum number of
          overhand shuffles you want the algorithm to tolerate within the
          shuffles
        </li>
      </ul>
      <p>
        If you are not sure how to perform any of the shuffles please have a
        look in the explanations tab!
      </p>
    </div>
  );
}

function LoadingDisplay(props) {
  return (
    <div style={{ height: "100%" }}>
      <p>Generating Stack...</p>
      <div className="loader"></div>
    </div>
  );
}
