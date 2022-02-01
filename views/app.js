const RUN_URL = "http://localhost:3000/Generated_Mem_Deck/RunGA";
const ALTER_AMOUNT_URL =
  "http://localhost:3000/Generated_Mem_Deck/Alter_Amount_Of_Shuffles";
const ALTER_SHUFFLE_PARAMS =
  "http://localhost:3000/Generated_Mem_Deck/Alter_Shuffle_Params";

const CUSTOM_SHUFF = "http://localhost:3000/Custom_Shuffle_Order/Generate";

console.log("Hello dir");

let result;

const getDeckButton = document.querySelector("#butt_getDeck");
const alterAmountShufflesButton = document.querySelector(
  "#butt_sendAmountShuffles"
);
const alterShuffleParamsButton = document.querySelector(
  "#butt_sendShuffleParams"
);

const getCustomShuffButton = document.querySelector("#customShuff");

const alterAmountTest = {
  numFaros: -1,
  numCutDeck: -1,
  numDealPiles: -1,
  numOverhandShuffles: -1,
  numDealClumps: -1,
  minNumShuffles: 6,
  maxNumShuffles: 7,
};

// ['numberOfShuffles','cutDeck_CutPos','dealPiles_NumPiles','dealPiles_CardsPerPile',
//                         'overhandShuffle_numShuffles','overhandShuffle_cardsPerShuffle','dealClumps_numDeals',
//                         'dealClumps_CardsPerDeal'];
const shuffleParamsTest = {
  numberOfShuffles: { min: 1, max: 1 },
  cutDeck_CutPos: { min: 1, max: 1 },
  dealPiles_NumPiles: { min: 1, max: 1 },
  dealPiles_CardsPerPile: { min: 1, max: 1 },
  overhandShuffle_numShuffles: { min: 1, max: 1 },
  overhandShuffle_cardsPerShuffle: { min: 1, max: 1 },
  dealClumps_numDeals: { min: 1, max: 1 },
  dealClumps_CardsPerDeal: { min: 1, max: 1 },
};

getDeckButton.addEventListener("click", () => {
  console.log("CLicked Bish");
  fetch(RUN_URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      console.log(res);
    });
});

alterAmountShufflesButton.addEventListener("click", () => {
  console.log("Clicked Bish - Alter Amount");
  fetch(ALTER_AMOUNT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(alterAmountTest),
  });
});

alterShuffleParamsButton.addEventListener("click", () => {
  console.log("Clicked Bish - Alter Shuffle Params");
  fetch(ALTER_SHUFFLE_PARAMS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(shuffleParamsTest),
  });
});

getCustomShuffButton.addEventListener("click", () => {
  console.log("Clicked Bish - Alter Shuffle Params");
  const test = [
    { type: "Faro Shuffle", params: [] },
    { type: "Overhand Shuffle", params: [1, 2, 3] },
  ];
  fetch(CUSTOM_SHUFF, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(test),
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      console.log(res);
    });
});
