#ifndef CUSTOM_SHUFFLE_H
#define CUSTOM_SHUFFLE_H

#include "CardShuffles.h"
#include "Deck.h"
#include <sstream>
// Below is the master function that will return the JSON required to send back to Node\
//Note: Params[0] contains the keys for each shuffle selected, the rest of the vectors are the parameters themselves
std::string getCustomOrderFromShuffles(vector<vector<int>> params);

vector<CardShuffle *> configureShuffles(vector<vector<int>> params);
std::string printDeckToJSON(int *order);

#endif
