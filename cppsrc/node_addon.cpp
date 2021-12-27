//Code to bridge between the GA stuff with node
#include <napi.h>
#include <string>
#include "ga_src/GA.h"

extern class GA ga;

Napi::String RunGA(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();

    //call 'helloUser' function from 'greetings.cpp' file
    //Warning: we are passing hardcoded 'MIKE' for now
    // std::string user = (std::string) info[0].ToString();
    // std::string result = helloUser( user );

    for(int i = 0; i<100; i++){
        ga.Generate();
    }

    std::string result = ga.LogToJson();

    //return new Napi::string value
    return Napi::String::New(env,result);
}

//Callback method when module is registered with Node.js
Napi::Object Init(Napi::Env env, Napi::Object exports){

    //set a key on 'exports' object
    exports.Set(
        Napi::String::New(env, "RunGA"),
        Napi::Function::New(env, RunGA)
    );

    return exports;
}

NODE_API_MODULE(greet,Init);