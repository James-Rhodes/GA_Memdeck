#include "GA.h"

GenomeParamLimits genomeParamLimits;
FitnessScaling fitnessScale;
MaxNumberOfEachShuffle maxShuffles;
GA ga(2500,0.05);

void Genome::Init(){
    numShuffles = GetRandomInt(genomeParamLimits.numberOfShuffles[0],genomeParamLimits.numberOfShuffles[1]);

    for(int i = 0; i<numShuffles; i++){
        shuffles.push_back(CardShuffleGenerator());
        shuffles[i]->GenerateParams();
    }
}

void Genome::Shuffle(){
    shuffler.Shuffle(shuffles);
    shuffler.CalculateUnshuffleOrder();
}

void Genome::PrintParams(){
    for(CardShuffle* shuf : shuffles){
        shuf->PrintInfo();
    }
}

double Genome::CalcFitness(Deck& deck){
    Shuffle();
    fitness = 0;
    SimilarityParams similarity = deck.DetermineSimilarity(shuffler.order);
    fitness += fitnessScale.sameColour * (similarity.numSameColour/100.0f);
    fitness += fitnessScale.sameValue * (similarity.numSameValue/78.0f);
    fitness += fitnessScale.sameSuit * (similarity.numSameSuit/96.0f);
    fitness += fitnessScale.sameOddEven * (similarity.numSameOddEven/100.0f);
    fitness += fitnessScale.inOrder * (similarity.numInOrder/104.0f);
    fitness += fitnessScale.numberOfShuffles * ((float)numShuffles/genomeParamLimits.numberOfShuffles[1]);
    fitness += fitnessScale.maxAmountOfEachShuffleScale * PenaliseExceedingMaxNumShuffles();
    fitness = exp(50/fitness); // Can change this
    return fitness;
}

double Genome::PenaliseExceedingMaxNumShuffles(){
    //This function creates a number between 0-1 with 1 being bad and 0 being good if the current genome exceeds the maximum amount of each shuffle
    double result = 0;

    ShuffleCounter counter;
    for(CardShuffle* shuf : shuffles){
        shuf->IncreaseCounter(counter);
    }

//Confusing but works... do this better. Basically says that if there is a limit (maxshuffles != -1) and its greater than the limit then add 
    int totalOverMax = (counter.faroShuffles>maxShuffles.faros)*(maxShuffles.faros != -1)*counter.faroShuffles + 
                        (counter.cutDecks>maxShuffles.cutDeck)*(maxShuffles.cutDeck != -1)*counter.cutDecks + 
                        (counter.dealPiles>maxShuffles.dealPiles)*(maxShuffles.dealPiles != -1)*counter.dealPiles + 
                        (counter.overhandShuffles>maxShuffles.overhandShuffle)*(maxShuffles.overhandShuffle != -1)*counter.overhandShuffles + 
                        (counter.dealClumps>maxShuffles.dealClumps)*(maxShuffles.dealClumps != -1)*counter.dealClumps;
//For scaling between 0-1
    int numShufflesThatArePenalised = ((maxShuffles.faros != -1) + (maxShuffles.cutDeck != -1) + (maxShuffles.dealPiles != -1) +
                                        (maxShuffles.overhandShuffle != -1) + (maxShuffles.dealClumps != -1))*numShuffles;

    result = (double)totalOverMax/numShufflesThatArePenalised;
    return result;
}

void Genome::CrossOver(const Genome& partnerA, const Genome& partnerB){

    numShuffles = GetRandom()>0.5 ? partnerA.numShuffles: partnerB.numShuffles;
    for(int i = 0; i<numShuffles; i++){
        if(i<partnerA.numShuffles && i<partnerB.numShuffles){
            //Alternate between the two
            if(i%2 == 0){
                shuffles.push_back(partnerA.shuffles[i]->Clone());      
            }else{
                shuffles.push_back(partnerB.shuffles[i]->Clone());
            }
        }else{
            if(i<partnerA.numShuffles){
                shuffles.push_back(partnerA.shuffles[i]->Clone());
            }else if(i<partnerB.numShuffles){
                shuffles.push_back(partnerB.shuffles[i]->Clone());  
            }
        }
    }
}
void Genome::Mutate(float mr){
    float randNum = GetRandom();
    int oldNumShuffles = numShuffles;
    
    //Randomly decide to resize the number of shuffles 
    if(randNum < mr){
        oldNumShuffles = numShuffles;
        shuffles.resize(numShuffles);
    }

    for(size_t i = 0; i<shuffles.size(); i++){
        //initialise the new number of shuffles if the new number is larger than the previous
        if((int)(i+1) > oldNumShuffles){
            shuffles[i] = CardShuffleGenerator();
            shuffles[i]->GenerateParams();
        }
        randNum = GetRandom();
        if(randNum<mr){
            shuffles[i]->GenerateParams();
        }
    }

    randNum = GetRandom();
    if(randNum<mr){
        //shuffle the order of shuffles
        for(size_t i = 0; i<shuffles.size(); i++){
            int randIndex = GetRandomInt(0,shuffles.size()-1);
            std::swap(shuffles[i],shuffles[randIndex]);
        }
    }
}

void GA::InitAll(){
    for(int i = 0; i<populationSize; i++){
        genomes[i].Init();
    }
    CalcAllFitness();
}
void GA::CrossoverAll(){
    // TODO: Try to add one point crossover instead of shuffling evenly
    Genome* children = new Genome[populationSize];
    std::qsort(genomes,populationSize,sizeof(Genome),compareGenomes);

    for(int i = 0; i<populationSize; i++){

        if(i<survivalRate*populationSize){
            for(CardShuffle* shuf : genomes[i].shuffles){
                children[i].shuffles.push_back(shuf->Clone());
            }
            children[i].numShuffles = genomes[i].numShuffles;
        }else{
            // int parentAIndex = PickIndex();
            // int parentBIndex = PickIndex(); // Equivalent of randomly choosing two different parents based on their fitness
            int parentAIndex = TournamentSelection();
            int parentBIndex = TournamentSelection();
            while(parentBIndex == parentAIndex){
                parentBIndex = TournamentSelection();
            }
            children[i].CrossOver(genomes[parentAIndex],genomes[parentBIndex]);
        }
    }
    std::swap(genomes,children);
    delete[] children;
}
void GA::CalcAllFitness(){
    totalFitness = 0;
    float bestFitness = -1;
    indexOfBest = -1;
    for(int i = 0; i<populationSize; i++){
        float currentFitness = genomes[i].CalcFitness(deck);
        if(currentFitness>bestFitness){
            bestFitness = currentFitness;
            indexOfBest = i;
        }

        totalFitness += currentFitness;
    }
}
void GA::MutateAll(){
    for(int i = 0; i<populationSize; i++){
        genomes[i].Mutate(mr);
    }
}
void GA::Generate(){

    CrossoverAll();
    MutateAll();
    CalcAllFitness();
    // PrintBest();
    if(logging){
        if(prevBestFitness != genomes[indexOfBest].fitness){
            prevBestFitness = genomes[indexOfBest].fitness;
            LogInfo();
        }
    }
}
void GA::PrintBest(){
    cout<<endl<<"Current Best"<<endl;
    cout<<"Fitness: "<<genomes[indexOfBest].fitness<<endl;
    genomes[indexOfBest].PrintParams();
    cout<<"\n";
}

void GA::PrintBestOrder(){
    cout<<"Best Order:"<<endl;

    deck.PrintDeck(genomes[indexOfBest].shuffler.order);
    cout<<endl;
}
void GA::LogFileIntroduction(){
    cout.rdbuf(outFile.rdbuf()); // save current buffer
    std::cout.rdbuf(outFile.rdbuf()); //redirect std::cout to out.txt!

    time_t now = time(0); // Get current time
    cout<<logFileName<< " - "<<ctime(&now)<<endl; // convert time to string

    std::cout.rdbuf(coutbuf); // Return it back to standard cout
}

void GA::LogInfo(){
    cout.rdbuf(outFile.rdbuf()); // save current buffer
    std::cout.rdbuf(outFile.rdbuf()); //redirect std::cout to out.txt!

    PrintBest();
    PrintBestOrder();
    cout<<"******************"<<endl;

    std::cout.rdbuf(coutbuf); // Return it back to standard cout
}

string GA::LogToString(){

    std::stringstream buffer;
    std::streambuf * old = std::cout.rdbuf(buffer.rdbuf());

    PrintBest();
    PrintBestOrder();

    std::string text = buffer.str();

    std::cout.rdbuf( old );

    return text;
}

string GA::LogToJson(){

    std::stringstream buffer;
    std::streambuf * old = std::cout.rdbuf(buffer.rdbuf());

    cout<<"{\"Shuffles\":[";

    for(size_t i = 0; i<genomes[indexOfBest].shuffles.size(); i++){

        genomes[indexOfBest].shuffles[i]->LogJson();

        if((int)i != (int)genomes[indexOfBest].shuffles.size()-1){
            cout<<",";
        }
    }

    cout<<"],\"Order\":\"";
    deck.PrintDeck(genomes[indexOfBest].shuffler.order);
    cout<<"\""<<"}";

    std::string text = buffer.str();

    std::cout.rdbuf( old );

    return text;
}

int GA::PickIndex(){
    float randNum = GetRandom();
    float accumulation = 0;
    float prob;

    while(randNum == 0){
        randNum = GetRandom();
    }

    for(int i=0; i<populationSize; i++){
        prob = genomes[i].fitness/totalFitness;
        accumulation += prob;
        if(accumulation>= randNum){
            return i;
        }
    }
    return populationSize-1;
}

int GA::TournamentSelection(){
    int bestIndex = -1;
    int selectionPool = populationSize * selectionPoolPercentage;
    for(int i = 0; i < selectionPool; i++){
        int randIndex = GetRandomInt(0,populationSize-1);
        if(bestIndex == -1){
            bestIndex = randIndex;

        }else if(genomes[randIndex].fitness>genomes[bestIndex].fitness){
            bestIndex = randIndex;
        }
    }

    return bestIndex;
}


int compareGenomes(const void * a, const void * b){
  if ( *(Genome*)a <  *(Genome*)b) return 1;
  if ( *(Genome*)a == *(Genome*)b ) return 0;
  if ( *(Genome*)a >  *(Genome*)b ) return -1;
  return (int)NULL;
}