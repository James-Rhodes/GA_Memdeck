const { fork } = require("child_process");

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

const childProcess = fork("./ga_child_process.js");
childProcess.send(testInput);
childProcess.on("message", (message) => {
  console.log(message);
});

// ga.SetAmountOfShuffles(testInput);
// const result = testAsync();
// console.log(result);
// console.log("Hello?");
// testLog();

for (let j = 0; j < 1000; j++) {
  console.log("yezzir");
}
