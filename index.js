const { ga } = require("./src/ga_memdeck");
const express = require("express");
const app = express();
const path = require("path");
// const obj = {numFaros : 1,numCutDeck : 2,numDealPiles : 3,numOverhandShuffles : 4,numDealClumps : 5};

//Below allows for post requests to be received as json
app.use(express.json());
app.use("/views", express.static(__dirname + "/views"));

// app.set('views',path.join(__dirname,'views'));

app.get("/Generated_Mem_Deck", (req, res) => {
  // res.send("Hello Site");
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/Generated_Mem_Deck/RunGA", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  let result;
  console.log(ga.numIterations);
  for (let i = 0; i < ga.numIterations; i++) {
    result = ga.RunGA();
    console.log("Ran Iteration!!", i);
  }
  result = result.replace('"\n', '"');
  result = result.replace('\n"', '"');
  result = result.replace(/\n|\r/g, ",");
  res.send(result);
});

app.post("/Generated_Mem_Deck/Alter_Amount_Of_Shuffles", (req, res) => {
  try {
    ga.SetAmountOfShuffles(req.body);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/Generated_Mem_Deck/Alter_Shuffle_Params", (req, res) => {
  ga.SetShuffleParams(req.body);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
