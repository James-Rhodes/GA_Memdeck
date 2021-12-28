const ga = require("./src/ga_memdeck");

const obj = {numFaros : 1,numCutDeck : 2,numDealPiles : 3,numOverhandShuffles : 4,numDealClumps : 5};

for(let i = 0; i<100; i++){
    const result = ga.RunGA();
    ga.SetAmountOfShuffles(obj);

    console.log(result);
}