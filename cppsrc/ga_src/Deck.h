#ifndef DECK_H
#define DECK_H
#include <string>
#include <iostream>
#include <fstream>
#include <vector>
#include "CardShuffles.h"
using namespace std;

struct SimilarityParams{
    int numSameColour = 0;
    int numSameValue = 0;
    int numSameSuit = 0;
    int numSameOddEven = 0;
    int numInOrder = 0;

    void printParams(){
        cout<<"Same Colour: "<<numSameColour<<endl;
        cout<<"Same Value: "<<numSameValue<<endl;
        cout<<"Same Suit: "<<numSameSuit<<endl;
        cout<<"Same Odd/Even: "<<numSameOddEven<<endl;
        cout<<"Number in Order: "<<numInOrder<<endl;
    }
};
struct Card{
    string name;
    int value;
    int colour; //colour is 1 for red and 0 for black
    char suit;

    Card(){};
    Card(string _name){
        Init(_name);
    };
    void Init(string _name){
        name = _name;
        suit = name[1];

        if(name[0] == 'J'){
            value = 11;
        }else if(name[0] == 'Q'){
            value = 12;
        }else if(name[0] == 'K'){
            value = 13;
        }else if(name[0] == '1' && name[1] == '0'){
            value = 10;
            suit = name[2];
        }else{
            value = int(name[0]) - '0';
        }

        if(suit == 'H' || suit == 'D'){
            colour = 1;
        }else{
            colour = 0;
        }
    };
};

class Deck{
    //Note: face of deck is order[0].
    public:
        Card cards[52];
        const int numCards = 52;
        Deck(){
            InitialiseNDO();
        };

        void InitialiseNDO();
        void PrintDeck(int* order);
        SimilarityParams DetermineSimilarity(int* order);
};

class CardShuffler{
    public:
        int order[52];
        const int numCards = 52;

        CardShuffler(){
            for(int i = 0; i<numCards; i++){
                order[i] = i;
            }
        }
        ~CardShuffler(){
        };

        void CalculateUnshuffleOrder();
        void Shuffle(vector<CardShuffle*> shuffles);
};
#endif 
