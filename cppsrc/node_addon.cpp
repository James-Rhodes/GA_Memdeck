// Code to bridge between the GA stuff with node
#include <napi.h>
#include <string>
#include <iostream>
#include "ga_src/GA.h"

extern class GA ga;
extern class MaxNumberOfEachShuffle maxShuffles;
extern class GenomeParamLimits genomeParamLimits;

Napi::String RunGA(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    for (int i = 0; i < 100; i++)
    {
        ga.Generate();
    }

    std::string result = ga.LogToJson();
    return Napi::String::New(env, result);
}

Napi::String SetAmountOfShuffles(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() != genomeParamLimits.typesOfShuffles + 2)
    {
        Napi::TypeError::New(env, "Incorrect Number of Elements").ThrowAsJavaScriptException();
        return Napi::String::New(env, "");
    }

    maxShuffles.faros = info[0].As<Napi::Number>().Int32Value();
    maxShuffles.cutDeck = info[1].As<Napi::Number>().Int32Value();
    maxShuffles.dealPiles = info[2].As<Napi::Number>().Int32Value();
    maxShuffles.overhandShuffle = info[3].As<Napi::Number>().Int32Value();
    maxShuffles.dealClumps = info[4].As<Napi::Number>().Int32Value();
    genomeParamLimits.numberOfShuffles[0] = info[5].As<Napi::Number>().Int32Value();
    genomeParamLimits.numberOfShuffles[1] = info[6].As<Napi::Number>().Int32Value();

    ga.InitAll();

    return Napi::String::New(env, "Complete");
}

Napi::String SetShuffleParams(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    // Below is hard coded, work out how to fix it later
    if (info.Length() != 16)
    {
        Napi::TypeError::New(env, "Incorrect Number of Elements").ThrowAsJavaScriptException();
        return Napi::String::New(env, "");
    }

    genomeParamLimits.numberOfShuffles[0] = info[0].As<Napi::Number>().Int32Value();
    genomeParamLimits.numberOfShuffles[1] = info[1].As<Napi::Number>().Int32Value();

    genomeParamLimits.cutDeck_CutPos[0] = info[2].As<Napi::Number>().Int32Value();
    genomeParamLimits.cutDeck_CutPos[1] = info[3].As<Napi::Number>().Int32Value();

    genomeParamLimits.dealPiles_NumPiles[0] = info[4].As<Napi::Number>().Int32Value();
    genomeParamLimits.dealPiles_NumPiles[1] = info[5].As<Napi::Number>().Int32Value();

    genomeParamLimits.dealPiles_CardsPerPile[0] = info[6].As<Napi::Number>().Int32Value();
    genomeParamLimits.dealPiles_CardsPerPile[1] = info[7].As<Napi::Number>().Int32Value();

    genomeParamLimits.overhandShuffle_numShuffles[0] = info[8].As<Napi::Number>().Int32Value();
    genomeParamLimits.overhandShuffle_numShuffles[1] = info[9].As<Napi::Number>().Int32Value();

    genomeParamLimits.overhandShuffle_cardsPerShuffle[0] = info[10].As<Napi::Number>().Int32Value();
    genomeParamLimits.overhandShuffle_cardsPerShuffle[1] = info[11].As<Napi::Number>().Int32Value();

    genomeParamLimits.dealClumps_numDeals[0] = info[12].As<Napi::Number>().Int32Value();
    genomeParamLimits.dealClumps_numDeals[1] = info[13].As<Napi::Number>().Int32Value();

    genomeParamLimits.dealClumps_CardsPerDeal[0] = info[14].As<Napi::Number>().Int32Value();
    genomeParamLimits.dealClumps_CardsPerDeal[1] = info[15].As<Napi::Number>().Int32Value();

    ga.InitAll();

    return Napi::String::New(env, "Complete");
}

// Callback method when module is registered with Node.js
Napi::Object Init(Napi::Env env, Napi::Object exports)
{

    // set a key on 'exports' object
    exports.Set(
        Napi::String::New(env, "RunGA"),
        Napi::Function::New(env, RunGA));

    exports.Set(
        Napi::String::New(env, "_SetAmountOfShuffles"),
        Napi::Function::New(env, SetAmountOfShuffles));

    exports.Set(
        Napi::String::New(env, "_SetShuffleParams"),
        Napi::Function::New(env, SetShuffleParams));

    return exports;
}

NODE_API_MODULE(RunningGA, Init);