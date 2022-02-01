#ifndef CARDSHUFFLES_H
#define CARDSHUFFLES_H
#include <algorithm>
#include <iostream>
#include "RandNumGen.h"
#include "GlobalParams.h"
using namespace std;

struct ShuffleCounter
{
    // Add a counter for each new type of shuffle that is added as well as adding it to the generator function
    ShuffleCounter(){};

    int faroShuffles = 0;
    int cutDecks = 0;
    int dealPiles = 0;
    int overhandShuffles = 0;
    int dealClumps = 0;
};

class CardShuffle
{
public:
    const int numCards = 52;
    CardShuffle(){};
    virtual ~CardShuffle() = default;
    virtual CardShuffle *Clone() const = 0;

    virtual void GenerateParams() = 0;
    virtual void SetParams(vector<int> params) = 0;
    virtual void Shuffle(int (&order)[52]) = 0;
    virtual void IncreaseCounter(ShuffleCounter &counter) = 0;
    virtual void PrintInfo() = 0;
    virtual void LogJson() = 0;
};

template <class Derived>
class CloneableCardShuffle : public CardShuffle
{
    virtual CardShuffle *Clone() const
    {
        return new Derived(static_cast<const Derived &>(*this));
    }
};

class FaroShuffle : public CloneableCardShuffle<FaroShuffle>
{
public:
    FaroShuffle(){};

    void GenerateParams();
    void SetParams(vector<int> params);
    void Shuffle(int (&order)[52]);
    void IncreaseCounter(ShuffleCounter &counter);
    void PrintInfo();
    void LogJson();
};

class CutDeck : public CloneableCardShuffle<CutDeck>
{
public:
    CutDeck(){};

    void GenerateParams();
    void SetParams(vector<int> params);
    void Shuffle(int (&order)[52]);
    void IncreaseCounter(ShuffleCounter &counter);
    void PrintInfo();
    void LogJson();

    int pos;
};

class DealPiles : public CloneableCardShuffle<DealPiles>
{
public:
    DealPiles(){};

    void GenerateParams();
    void SetParams(vector<int> params);
    void Shuffle(int (&order)[52]);
    void IncreaseCounter(ShuffleCounter &counter);
    void PrintInfo();
    void LogJson();

    int numPiles;
    int cardsPerPile;
};

class OverhandShuffle : public CloneableCardShuffle<OverhandShuffle>
{
public:
    OverhandShuffle(){};

    void GenerateParams();
    void SetParams(vector<int> params);
    void Shuffle(int (&order)[52]);
    void IncreaseCounter(ShuffleCounter &counter);
    void PrintInfo();
    void LogJson();

    vector<int> cardsPerShuffle;
};

class DealClumps : public CloneableCardShuffle<DealClumps>
{
public:
    DealClumps(){};

    void GenerateParams();
    void SetParams(vector<int> params);
    void Shuffle(int (&order)[52]);
    void IncreaseCounter(ShuffleCounter &counter);
    void PrintInfo();
    void LogJson();

    vector<int> cardsPerDeal;
};

CardShuffle *CardShuffleGenerator(int key = -1);

#endif