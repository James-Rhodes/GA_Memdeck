#include "CardShuffles.h"

extern struct GenomeParamLimits genomeParamLimits;
extern struct FitnessScaling fitnessScale;
extern struct MaxNumberOfEachShuffle maxShuffles;

void FaroShuffle::GenerateParams(){}

void FaroShuffle::Shuffle(int (&order)[52]){
    int tempOrder[52];

    for(int i = 0; i < numCards/2; i++){
        tempOrder[2*i + 0] = order[0  + i];
        tempOrder[2*i + 1] = order[26 + i];
    }

    std::swap(tempOrder,order);
}

void FaroShuffle::PrintInfo(){
    cout<<"Faro Shuffle"<<endl;
}

void FaroShuffle::IncreaseCounter(ShuffleCounter& counter){
    counter.faroShuffles++;
}

void FaroShuffle::LogJson(){
    cout<<"{\"Type\":\"Faro Shuffle\"}";
}

void CutDeck::GenerateParams(){
    pos = GetRandomInt(genomeParamLimits.cutDeck_CutPos[0],genomeParamLimits.cutDeck_CutPos[1]);
}

void CutDeck::Shuffle(int (&order)[52]){
    //cuts deck at pos from the top of face down deck
    if(pos < 0){
        pos = 0;
    }else if(pos > 52){
        pos = 52;
    }
    int posFromFace = numCards - pos;
    int tempOrder[52];
    
    for(int i = 0; i<numCards; i++){
        if(i<pos){
            tempOrder[i] = order[posFromFace + i];
        }else{
           tempOrder[i] = order[i - pos];
        }
    } 
    std::swap(tempOrder,order);
}

void CutDeck::PrintInfo(){
    cout<<"Cut Deck: ";
    cout<<pos<<endl;
}

void CutDeck::IncreaseCounter(ShuffleCounter& counter){
    counter.cutDecks++;
}

void CutDeck::LogJson(){
    cout<<"{\"Type\":\"Cut Deck\",\"Position\":\""<<pos<<"\"}";
}

void DealPiles::GenerateParams(){
    numPiles = GetRandomInt(genomeParamLimits.dealPiles_NumPiles[0],genomeParamLimits.dealPiles_NumPiles[1]);
    cardsPerPile = GetRandomInt(genomeParamLimits.dealPiles_CardsPerPile[0],genomeParamLimits.dealPiles_CardsPerPile[1]);
}

void DealPiles::Shuffle(int (&order)[52]){
    //Dealing piles left to right and picking up right to left then place on top of the deck
    int amountDelt = numPiles*cardsPerPile;
    vector<vector<int>> piles(numPiles); //Creates numPiles vectors to add to
    int pileIndex = 0;
    for(int i = 0; i<amountDelt; i++){
        piles[pileIndex].push_back(order[numCards-1-i]);
        pileIndex = (pileIndex+1)%numPiles;
    }
    int index = numCards - amountDelt;
    for(int i = 0; i<numPiles; i++){
        for(int j = 0; j<cardsPerPile; j++){
            order[index] = piles[i][j];
            index++;
        }
    }    
}

void DealPiles::PrintInfo(){
    cout<<"Deal Piles: "<<numPiles<<" Piles of "<<cardsPerPile<<" Cards"<<endl;
}

void DealPiles::IncreaseCounter(ShuffleCounter& counter){
    counter.dealPiles++;
}

void DealPiles::LogJson(){
    cout<<"{\"Type\":\"Deal Poker Hands\",\"NumberOfPiles\":\""<<numPiles<<"\","<<"\"CardsPerPile\":\""<<cardsPerPile<<"\"}";
}

void OverhandShuffle::GenerateParams(){
    //Overhand shuffle vector with number of cards per shuffle (generate a random num of shuffles)
    cardsPerShuffle.clear();
    for(int i = 0; i<GetRandomInt(1,genomeParamLimits.overhandShuffle_numShuffles[1]); i++){
        cardsPerShuffle.push_back(GetRandomInt(genomeParamLimits.overhandShuffle_cardsPerShuffle[0],genomeParamLimits.overhandShuffle_cardsPerShuffle[1]));
    }
}
void OverhandShuffle::Shuffle(int (&order)[52]){
    int tempOrder[52];
    int numShuffles = cardsPerShuffle.size();
    int totalCards = 0;
    for(int numCards : cardsPerShuffle){
        totalCards += numCards;
    }
    vector<int> shuffledBank(totalCards);

    int indexOffset = 0;
    int orderIndexOffset = 1;
    for(int i = 0; i<numShuffles; i++){
        int endIndex = totalCards - indexOffset; 
        indexOffset += cardsPerShuffle[i];
        int beginIndex = totalCards - indexOffset;
        for(int j = beginIndex; j<endIndex; j++){
            shuffledBank[j] = order[numCards - orderIndexOffset];
            orderIndexOffset++;
        }
    }
    for(int i = 0; i<numCards; i++){
        if(i<totalCards){
            tempOrder[i] = shuffledBank[i];
        }else{
            tempOrder[i] = order[i-totalCards];
        }
    }
    std::swap(tempOrder,order);
}
void OverhandShuffle::PrintInfo(){
    cout<<"Overhand Shuffle: ";
    for(size_t i = 0; i<cardsPerShuffle.size(); i++){
        cout<<cardsPerShuffle[i];
        if((int)i != (int)cardsPerShuffle.size()-1){
            cout<<", ";
        }
    }
    cout<<endl;
}

void OverhandShuffle::LogJson(){
    cout<<"{\"Type\":\"Overhand Shuffle\",\"NumberOfShuffles\":\""<<(int)cardsPerShuffle.size()<<"\",\"Shuffles\":[";
    for(size_t i = 0; i<cardsPerShuffle.size(); i++){
        cout<<"\""<<cardsPerShuffle[i]<<"\"";
        if((int)i != (int)cardsPerShuffle.size()-1){
            cout<<",";
        }
    }
    cout<<"]}";
}

void OverhandShuffle::IncreaseCounter(ShuffleCounter& counter){
    counter.overhandShuffles++;
}

void DealClumps::GenerateParams(){
    //Dealing clumps random num of cards per shuffle (generate a random num of shuffles)
    cardsPerDeal.clear();
    for(int i = 0; i<GetRandomInt(1,genomeParamLimits.dealClumps_numDeals[1]); i++){
        cardsPerDeal.push_back(GetRandomInt(genomeParamLimits.dealClumps_CardsPerDeal[0],genomeParamLimits.dealClumps_CardsPerDeal[1]));
    }
}

void DealClumps::Shuffle(int (&order)[52]){
    //Placing the rest of the deck on top 
    int tempOrder[52];
    int totalCardsDelt = 0;
    for(size_t i = 0; i<cardsPerDeal.size(); i++){
        totalCardsDelt += cardsPerDeal[i];
    }
    vector<int> deltCards(totalCardsDelt);
    int offset = 0;
    int vecIndex = 0;
    for(size_t i = 0; i<cardsPerDeal.size(); i++){
        offset += cardsPerDeal[i];
        int beginIndex = numCards - offset;
        for(int j = beginIndex; j<beginIndex + cardsPerDeal[i];j++){
            deltCards[vecIndex] = order[j];
            vecIndex++;
        }
    }

    for(int i = 0; i<numCards; i++){
        if(i<totalCardsDelt){
            tempOrder[i] = deltCards[i]; 
        }else{
            tempOrder[i] = order[i-totalCardsDelt];
        }
    }

    std::swap(tempOrder,order);
}

void DealClumps::PrintInfo(){
    cout<<"Dealing Clumps: ";
    for(size_t i = 0; i<cardsPerDeal.size(); i++){
        cout<<cardsPerDeal[i];
        if((int)i != (int)cardsPerDeal.size()-1){
            cout<<", ";
        }
    }
    cout<<endl;
}

void DealClumps::LogJson(){
    cout<<"{\"Type\":\"Dealing In Clumps\",\"NumberOfDeals\":\""<<(int)cardsPerDeal.size()<<"\",\"Deals\":[";
    for(size_t i = 0; i<cardsPerDeal.size(); i++){
        cout<<"\""<<cardsPerDeal[i]<<"\"";
        if((int)i != (int)cardsPerDeal.size()-1){
            cout<<",";
        }
    }
    cout<<"]}";
}

void DealClumps::IncreaseCounter(ShuffleCounter& counter){
    counter.dealClumps++;
}

CardShuffle* CardShuffleGenerator(){
    //Randomly generates a pointer to one of the base classes of CardShuffle. Note: must delete
    // The pointer after use. To add another function simply add the name to the enum and include the case in the
    // switch statement
    enum {FAROSHUFFLE, CUTDECK, DEALPILES, OVERHANDSHUFFLE, DEALCLUMPS, COUNT};
    int randNumber = GetRandomInt(0,COUNT - 1);

    switch(randNumber){
        case(FAROSHUFFLE):
            return new FaroShuffle();
        
        case(CUTDECK):
            return new CutDeck();
        
        case(DEALPILES):
            return new DealPiles();
        
        case(OVERHANDSHUFFLE):
            return new OverhandShuffle();
        
        case(DEALCLUMPS):
            return new DealClumps();
    }
    return nullptr;
}