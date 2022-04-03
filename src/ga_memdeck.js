const ga = require("../build/Release/ga.node");
ga.numIterations = 1;
ga.SetAmountOfShuffles = function (obj) {
  if (obj.iterations > 3) {
    throw new Error("Too many iterations requested");
  }
  if (isNaN(obj.iterations)) {
    throw new Error(
      "A number of iterations must be requested by including an iterations member of the object."
    );
  }
  ga.numIterations = obj.iterations;
  delete obj.iterations;
  const objParams = [
    "numFaros",
    "numCutDeck",
    "numPokerHands",
    "numOverhandShuffles",
    "numDealClumps",
    "minNumShuffles",
    "maxNumShuffles",
  ];
  let params = [];
  let containsMinusOne = false;
  let totalNumShuffles = 0;
  for (const property of objParams) {
    if (isNaN(obj[property])) {
      throw new Error(
        "Incorrect object type, the correct object contains numbers that are these parameters: numFaros, numCutDeck, numDealPiles, numOverhandShuffles, numDealClumps, minNumShuffles,maxNumShuffles"
      );
    }

    params.push(obj[property]);

    if (obj[property] == -1) {
      containsMinusOne = true;
    }
    if (property != "minNumShuffles" && property != "maxNumShuffles") {
      totalNumShuffles = totalNumShuffles + obj[property];
    }
  }
  if (totalNumShuffles < obj.minNumShuffles && !containsMinusOne) {
    throw new Error("Not Enough Shuffles Selected");
  }

  ga._SetAmountOfShuffles(...params);
};

ga.SetShuffleParams = function (obj) {
  const objParams = [
    "numberOfShuffles",
    "cutDeck_CutPos",
    "dealPiles_NumPiles",
    "dealPiles_CardsPerPile",
    "overhandShuffle_numShuffles",
    "overhandShuffle_cardsPerShuffle",
    "dealClumps_numDeals",
    "dealClumps_CardsPerDeal",
  ];
  let params = [];

  for (const property of objParams) {
    if (isNaN(obj[property].min) || isNaN(obj[property].max)) {
      throw `Property: ${property} max or min is undefined`;
    }
    params.push(obj[property].min);
    params.push(obj[property].max);
  }
  ga._SetShuffleParams(...params);
};

ga.GetCustomOrder = (obj) => {
  //obj is an array of objects with type: and params:
  let params = [];
  let shuffleKeys = [];

  for (let shuffle of obj) {
    if (!shuffle.params || !Array.isArray(shuffle.params)) {
      throw new Error(
        "The shuffle must contain a parameters array even if the array is empty"
      );
    }
    for (let num of shuffle.params) {
      if (NegativeOrNan(num)) {
        throw new Error(
          `${shuffle.type} can not have negative or nan parameters.`
        );
      }
    }
    let sum;
    switch (shuffle.type) {
      case "Faro Shuffle":
        if (shuffle.params.length !== 0) {
          throw new Error("Faro Shuffle should not have any parameters");
        }
        shuffleKeys.push(0);
        params.push(shuffle.params);
        break;

      case "Cut Deck":
        if (shuffle.params.length !== 1) {
          throw new Error(
            "Cutting the deck only requires one parameter (The position of the cut)"
          );
        }
        shuffleKeys.push(1);
        params.push(shuffle.params);
        break;

      case "Deal Poker Hands":
        if (shuffle.params.length !== 2) {
          throw new Error(
            "Dealing poker hands requires two parameters, the number of piles dealt and the number of cards per pile."
          );
        }
        if (shuffle.params[0] * shuffle.params[1] > 52) {
          throw new Error(
            `Deal Poker Hands has too many cards to be dealt for a standard deck of 52 cards. ${
              shuffle.params[0] * shuffle.params[1]
            } have been requested for dealing`
          );
        }
        shuffleKeys.push(2);
        params.push(shuffle.params);
        break;

      case "Overhand Shuffle":
        if (shuffle.params.length === 0) {
          throw new Error(
            "Overhand shuffle requires some shuffles to be specified."
          );
        }
        sum = shuffle.params.reduce((a, b) => a + b, 0);
        if (sum > 52) {
          throw new Error(
            `Too many cards requested to be dealt for dealing in clumps for a standard deck of 52 cards. ${sum} requested.`
          );
        }
        shuffleKeys.push(3);
        params.push(shuffle.params);

        break;

      case "Dealing In Clumps":
        sum = shuffle.params.reduce((a, b) => a + b, 0);
        if (sum > 52) {
          throw new Error(
            `Too many cards requested to be dealt for dealing in clumps for a standard deck of 52 cards. ${sum} requested.`
          );
        }
        shuffleKeys.push(4);
        params.push(shuffle.params);
        break;

      default:
        throw new Error(`Shuffle type ${shuffle.type} does not exist`);
    }
  }

  return ga._GetCustomOrder([shuffleKeys, ...params]);
};

function NegativeOrNan(num) {
  return isNaN(num) || num < 0;
}
// console.log(ga._GetCustomOrder([[0], []]));

module.exports = {
  ga,
};
