import React from "react";

const explanationContainerStyle = {
  marginLeft: "2%",
  marginBottom: "2em",
  marginRight: "2%",
};

export const ShuffleExplanations = (props) => {
  return (
    <div>
      <h1>Shuffle Explanations</h1>
      <div style={explanationContainerStyle}>
        <h2>Faro Shuffle</h2>
        <p>
          The way I like to perform a Faro shuffle is in such a way that the top
          and bottom card of the deck remain the same. As such this is how the
          Faro shuffle is performed on this website.
        </p>
      </div>

      <div style={explanationContainerStyle}>
        <h2>Cutting the Deck</h2>
        <p>
          Cutting the deck within this website refers to picking up the number
          of cards specified, off the top of the face down deck, placing it on
          the table and then placing the remainder of the cards on top.
        </p>
      </div>

      <div style={explanationContainerStyle}>
        <h2>Dealing Poker Hands</h2>
        <p>
          Dealing poker hands refers to dealing out cards from left to right on
          to the table in front of you with the deck face down. The shuffles
          will specify how many hands/piles to deal and how many cards each
          hand/pile will get. The process of dealing left to right is continued
          until each hand/pile has the correct number of cards. The hands/piles
          are collected from right to left with the far right packet going on
          top of the packet to it's left, this new combined packet then going on
          top of the next packet to its left and so forth. Once all of the cards
          are stacked, add the entire pile to the top of the cards in your hand.
        </p>
      </div>

      <div style={explanationContainerStyle}>
        <h2>Overhand Shuffles</h2>
        <p>
          The overhand shuffle is performed by running off the number of cards
          specified and repeating until all of the runs are complete. For
          example if the overhand shuffle states 2,3,4. two cards will be run
          off the top of the face down deck in overhand shuffle position, throw
          the rest of the deck on top. Again pick up the cards in overhand
          shuffle position and run three cards throwing the remainder of the
          deck on top. Finally, perform the shuffle again running off four
          cards. After the deck is thrown on top of the four cards the shuffle
          is complete
        </p>
      </div>

      <div style={explanationContainerStyle}>
        <h2>Dealing Clumps</h2>
        <p>
          Dealing clumps refers to a method of shuffling the deck where cards
          are dealt in clumps onto the table. For example if the shuffle
          specifies 2,3,4. Holding the deck face down, push over two cards and
          place them both face down onto the table. Push over three more cards
          and place them on top of the cards on the table. Repeat again with
          four cards. To complete the shuffle the remainder of the deck is
          placed on top of the cards on the table.
        </p>
      </div>
    </div>
  );
};
