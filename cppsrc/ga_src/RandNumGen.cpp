#include "RandNumGen.h"

double GetRandom()
{
    static std::mt19937 e(std::chrono::system_clock::now().time_since_epoch().count());
    static std::uniform_real_distribution<> dis(0, 1); // range 0 - 1
    return dis(e);
}

int GetRandomInt(int min, int max){
    max++;
    int result = floor((GetRandom()) * (max - min) / (1.0f) + min);

    return result;
}