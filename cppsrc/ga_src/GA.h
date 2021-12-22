#ifndef GA_H
#define GA_H
#include "Deck.h"
#include "RandNumGen.h"
#include "GlobalParams.h"
#include "CardShuffles.h"
#include <sstream>


int compareGenomes(const void * a, const void * b);

class Genome{
    friend class GA;
    public:

        double fitness = 0;
        
        Genome(){};
        ~Genome(){
            for(size_t i=0; i<shuffles.size(); i++){
                delete shuffles[i];
            }
        };
        bool operator==(const Genome &other){
            return this->fitness == other.fitness;
        }
        bool operator<(const Genome &other){
            return this->fitness < other.fitness;
        }
        bool operator>(const Genome &other){
            return this->fitness > other.fitness;
        }

        void Init();
        double CalcFitness(Deck& deck);
        double PenaliseExceedingMaxNumShuffles();
        void CrossOver(const Genome& partnerA, const Genome& partnerB);
        void Mutate(float mr);
        void PrintParams();
        

        private:
            int numShuffles;
            vector<CardShuffle*> shuffles; //stores all of the shuffles

            CardShuffler shuffler;
            void Shuffle();

};

class GA{
    public:

        GA(int numGenomes, float _mr){
            genomes = new Genome[numGenomes];
            mr = _mr;
            populationSize = numGenomes;

            InitAll();
        }

        GA(int numGenomes, float _mr,const string& _logFileName):outFile(_logFileName + ".txt",ios_base::app){
            genomes = new Genome[numGenomes];
            mr = _mr;
            populationSize = numGenomes;

            InitAll();

            logging = true;
            logFileName = _logFileName;
            coutbuf = cout.rdbuf();
            LogFileIntroduction();
            
        }
        ~GA(){
            delete[] genomes;
            // outFile.close();
        }


        void Generate();
        void PrintBest();
        void PrintBestOrder();
        string LogToString();

    private:
        GA(const GA&);
        GA& operator=(const GA&);
        void LogInfo();
        void LogFileIntroduction();
        void InitAll();
        void CrossoverAll();
        void CalcAllFitness();
        void MutateAll();
        int PickIndex();
        int TournamentSelection();

        Genome* genomes;
        float mr;
        int populationSize;
        int indexOfBest = 0;
        double totalFitness = 0;
        double prevBestFitness = 0;
        const float survivalRate = 0.5; //Amount of the current populations best that survives.
        const float selectionPoolPercentage = 0.01;
        Deck deck;

        //Log File Variables
        bool logging = false;
        string logFileName = "";
        ofstream outFile;
        std::streambuf *coutbuf;
            
};

#endif
