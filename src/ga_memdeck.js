const ga = require("../build/Release/ga.node");
ga.numIterations = 1;
ga.SetAmountOfShuffles = function (obj) {
  if (obj.iterations > 10) {
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
    "numDealPiles",
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

console.log(ga._GetCustomOrder([[0], []]));

module.exports = {
  ga,
};
