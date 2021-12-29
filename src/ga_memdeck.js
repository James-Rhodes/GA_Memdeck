const ga = require('../build/Release/ga.node');

ga.SetAmountOfShuffles = function(obj){
    const objParams = ['numFaros','numCutDeck','numDealPiles','numOverhandShuffles','numDealClumps'];
    let params = [];
    for(const property of objParams){
        if(isNaN(obj[property])){
            throw "Incorrect object type, the correct object contains numbers that are these parameters: numFaros, numCutDeck, numDealPiles, numOverhandShuffles, numDealClumps";
        }
        params.push(obj[property]);
    }

    ga._SetAmountOfShuffles(...params);
}

ga.SetShuffleParams = function(obj){
    const objParams = ['numberOfShuffles','cutDeck_CutPos','dealPiles_NumPiles','dealPiles_CardsPerPile',
                        'overhandShuffle_numShuffles','overhandShuffle_cardsPerShuffle','dealClumps_numDeals',
                        'dealClumps_CardsPerDeal'];
    let params = [];

    for(const property of objParams){
        if(isNaN(obj[property].min) && isNaN(obj[property].max)){
            throw `Property: ${property} max or min is undefined`;
        }
        params.push(obj[property].min);
        params.push(obj[property].max);
    }

    ga._SetShuffleParams(...params);
}

module.exports = ga;


