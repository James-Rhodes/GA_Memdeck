import React, { useState } from "react";
import { CustomShuffleSettings } from "./custom-shuffle-settings";
import { DisplayDeckOrder } from "../ag-shuffle/ag-displayResults";

const CUSTOM_SHUFF = "/Custom_Shuffle_Order/Generate";

export const CustomShuffleTab = (props) => {
  const [order, setOrder] = useState(null);

  const getCustomShuffle = (input) => {
    fetch(CUSTOM_SHUFF, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        setOrder(res.Order);
      });
  };

  const handleSubmit = (data) => {
    getCustomShuffle(data);
  };

  return (
    <div>
      <h1>Custom Shuffles</h1>
      <p>
        This tab can be used to work out what order the deck needs to be in such
        that after the shuffles, that you input below, the deck will return to
        new deck order.
      </p>
      <CustomShuffleSettings onSubmit={handleSubmit}></CustomShuffleSettings>
      {order && <DisplayDeckOrder order={order}></DisplayDeckOrder>}
    </div>
  );
};
