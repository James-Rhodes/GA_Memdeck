#include "Deck.h"

void Deck::InitialiseNDO(){
    char suits[] = {'S','D','C','H'};
    string values[] = {"1","2","3","4","5","6","7","8","9","10","J","Q","K"};

    for(int i = 0; i<26; i++){
        cards[i].Init(values[i%13] + suits[i/13]);
    }
    
    for(int i = 26; i<52; i++){
        cards[i].Init(values[12 - i%13] + suits[i/13]);
    }
}

void Deck::PrintDeck(int* order){
    for(int i = 0; i<numCards; i++){
        if(i%13 == 0){
            cout<<endl;
        }
        cout<<cards[order[i]].name;
        if((i+1)%13 != 0){
            cout<<',';
        }
    }
    cout<<endl;
}

SimilarityParams Deck::DetermineSimilarity(int* order){
//Consider adding the functionality to work out how many in a row of each colour etc occur
    SimilarityParams params;

    for(int i = 0; i<numCards; i++){
        for(int j = -1; j<=1; j+=2){
            int curIndex = order[i];
            int neighbourIndex = order[(i+j)%numCards < 0 ? numCards-1:(i+j)%numCards];
            if(cards[curIndex].value == cards[neighbourIndex].value){
                params.numSameValue++;
            }
            if(cards[curIndex].suit == cards[neighbourIndex].suit){
                params.numSameSuit++;
            }
            if(cards[curIndex].colour == cards[neighbourIndex].colour){
                params.numSameColour++;
            }
            if((cards[curIndex].value%2) == (cards[neighbourIndex].value%2)){
                params.numSameOddEven++;
            }
            if(abs(cards[curIndex].value%13 - cards[neighbourIndex].value%13) == 1){
                params.numInOrder++;
                // cout<<cards[curIndex].name<<" , "<<cards[neighbourIndex].name<<endl;
            }
        }
    }
    return params;
}

void CardShuffler::Shuffle(vector<CardShuffle*> shuffles){
    for(CardShuffle* shuf : shuffles){
        shuf->Shuffle(order);
    }


}

void CardShuffler::CalculateUnshuffleOrder(){
    int tempOrder[52];
    for(int i = 0; i<numCards; i++){
        tempOrder[order[i]] = i;
    }
    std::swap(tempOrder,order);
}


