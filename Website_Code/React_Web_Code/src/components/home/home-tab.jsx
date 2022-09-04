import React, { Component } from "react";
import cardSuits from "./../../Assets/Suits.png";

const textStyle = { marginLeft: "2em", marginRight: "2em" };

export const HomeTab = () => {
  return (
    <div>
      <h1>Welcome to Mem-Deck Creator!</h1>
      <div style={{ display: "flex", marginLeft: "2%" }}>
        <div>
          <p>
            This is a tool I have developed that can aid in adding a kicker
            ending to any of your tricks or give inspiration for creating your
            own.
          </p>
          <p>
            The auto-generate tab will generate a set of shuffles and an order
            such that when those shuffles are applied they bring the deck back
            to new deck order. This tab was designed to give inspiration for
            coming up with your own tricks that somehow incorporate the
            shuffles. The custom shuffles tab allows you to put in your own
            shuffles and work out what order the deck should be in such that
            after those shuffles it returns to new deck order. This will allow
            any tricks you already have that have a consistant set of shuffles
            to now have a kicker ending of the whole deck returning to new deck
            order.{" "}
          </p>
          <p>
            Thanks for visiting this site, I hope you enjoy and find it helpful!
          </p>
        </div>
        <img
          src={cardSuits}
          alt="card suits"
          style={{ width: "25%", height: "25%", marginRight: "5%" }}
        />
      </div>
    </div>
  );
};
