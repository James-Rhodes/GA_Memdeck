const RUN_URL = "http://localhost:3000/Generated_Mem_Deck/RunGA";
const ALTER_AMOUNT_URL = "http://localhost:3000/Generated_Mem_Deck/Alter_Amount_Of_Shuffles";

console.log("Hello dir")

let result;

const getDeckButton = document.querySelector("#butt_getDeck");
const alterAmountShufflesButton = document.querySelector("#butt_sendAmountShuffles");

const alterAmountTest = {numFaros:1,numCutDeck:2,numDealPiles:3,numOverhandShuffles:4,numDealClumps:5};

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
})
