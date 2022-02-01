#include "customShuffle.h"

std::string getCustomOrderFromShuffles(vector<vector<int>> params)
{
    CardShuffler cardShuffler;

    vector<CardShuffle *> shuffles = configureShuffles(params);
    cardShuffler.Shuffle(shuffles);
    cardShuffler.CalculateUnshuffleOrder();

    return printDeckToJSON(cardShuffler.order);
}

vector<CardShuffle *> configureShuffles(vector<vector<int>> params)
{
    vector<CardShuffle *> shuffles(params[0].size());
    int paramIndex = 1;
    for (size_t i = 0; i < params[0].size(); i++)
    {
        int shuffleKey = params[0][i];
        shuffles[i] = CardShuffleGenerator(shuffleKey);
        shuffles[i]->SetParams(params[paramIndex]);
        paramIndex++;
    }

    return shuffles;
}

std::string printDeckToJSON(int *order)
{
    std::stringstream buffer;
    std::streambuf *old = std::cout.rdbuf(buffer.rdbuf());
    Deck deck;

    cout << "{\"Order\":\"";
    deck.PrintDeck(order);
    cout << "\""
         << "}";

    std::string result = buffer.str();

    std::cout.rdbuf(old);

    return result;
}
