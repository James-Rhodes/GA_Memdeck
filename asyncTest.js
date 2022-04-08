const { ga } = require("./src/ga_memdeck");

const testInput = {
  iterations: 1,
  numFaros: -1,
  numCutDeck: 1,
  numPokerHands: 1,
  numOverhandShuffles: 1,
  numDealClumps: 1,
  minNumShuffles: 1,
  maxNumShuffles: 1,
};

ga.SetAmountOfShuffles(testInput);
const result = ga.RunGA();

console.log(result);
