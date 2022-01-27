#ifndef GLOBAL_PARAMS_H
#define GLOBAL_PARAMS_H

struct GenomeParamLimits
{
    // arrays with [0] being min and [1] being max for the parameters and the max/min allowable amount for each listed parameter

    int numberOfShuffles[2] = {5, 8};
    int cutDeck_CutPos[2] = {1, 51};
    int dealPiles_NumPiles[2] = {1, 4};
    int dealPiles_CardsPerPile[2] = {1, 4};
    int overhandShuffle_numShuffles[2] = {1, 5};
    int overhandShuffle_cardsPerShuffle[2] = {1, 5};
    int dealClumps_numDeals[2] = {1, 4};
    int dealClumps_CardsPerDeal[2] = {1, 5};
    int typesOfShuffles = 5;
};

struct FitnessScaling
{
    // This says how much it matters to the solution if these things occur eg. if it doesnt matter at all that the cards
    //  Are in order after everything set inOrder = 0
    float sameColour = 2;
    float sameValue = 5;
    float sameSuit = 4;
    float sameOddEven = 3;
    float inOrder = 5;
    float numberOfShuffles = 0;
    float maxAmountOfEachShuffleScale = 1000;
};

struct MaxNumberOfEachShuffle
{
    // Set the maximum number of each shuffle that the user would like eg. dont exceed 2 faro shuffles throughout the solutions
    // also to say you dont want any of that type of shuffle set it to zero and to -1 if it does not matter how many there are
    int faros = 2;
    int cutDeck = -1;
    int dealPiles = 0;
    int overhandShuffle = 2;
    int dealClumps = 2;
};

#endif