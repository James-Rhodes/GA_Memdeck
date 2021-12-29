const RUN_URL = "http://localhost:3000/Generated_Mem_Deck/RunGA";
const ALTER_AMOUNT_URL = "http://localhost:3000/Generated_Mem_Deck/Alter_Amount_Of_Shuffles";
const ALTER_SHUFFLE_PARAMS = "http://localhost:3000/Generated_Mem_Deck/Alter_Shuffle_Params";

console.log("Hello dir")

let result;

const getDeckButton = document.querySelector("#butt_getDeck");
const alterAmountShufflesButton = document.querySelector("#butt_sendAmountShuffles");
const alterShuffleParamsButton = document.querySelector("#butt_sendShuffleParams");

const alterAmountTest = {numFaros:1,numCutDeck:2,numDealPiles:3,numOverhandShuffles:4,numDealClumps:5};

// ['numberOfShuffles','cutDeck_CutPos','dealPiles_NumPiles','dealPiles_CardsPerPile',
//                         'overhandShuffle_numShuffles','overhandShuffle_cardsPerShuffle','dealClumps_numDeals',
//                         'dealClumps_CardsPerDeal'];
const shuffleParamsTest = {numberOfShuffles:{min:1,max:1},
                            cutDeck_CutPos:{min:1,max:1},
                            dealPiles_NumPiles:{min:1,max:1},
                            dealPiles_CardsPerPile:{min:1,max:1},
                            overhandShuffle_numShuffles:{min:1,max:1},
                            overhandShuffle_cardsPerShuffle:{min:1,max:1},
                            dealClumps_numDeals:{min:1,max:1},
                            dealClumps_CardsPerDeal:{min:1,max:1}};

getDeckButton.addEventListener("click",()=>{
    console.log("CLicked Bish");
    fetch(RUN_URL, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
        }).then(data=>{
            return data.json();
        }).then(res =>{
            console.log(res);
        });
})

alterAmountShufflesButton.addEventListener("click",()=>{
    console.log("Clicked Bish - Alter Amount");
    fetch(ALTER_AMOUNT_URL, {
        method: 'POST',
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         },
         body: JSON.stringify(alterAmountTest)
        });
});

alterShuffleParamsButton.addEventListener("click",()=>{
    console.log("Clicked Bish - Alter Shuffle Params");
    fetch(ALTER_SHUFFLE_PARAMS, {
        method: 'POST',
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         },
         body: JSON.stringify(shuffleParamsTest)
        });
});
