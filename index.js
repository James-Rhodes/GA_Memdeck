const { ga } = require("./src/ga_memdeck");
const express = require("express");
const app = express();
const path = require("path");
// const obj = {numFaros : 1,numCutDeck : 2,numDealPiles : 3,numOverhandShuffles : 4,numDealClumps : 5};

//Below allows for post requests to be received as json
app.use(express.json());
// app.use("/views", express.static(__dirname + "/views"));
app.use(express.static(path.resolve(__dirname, "./views")));

// app.set('views',path.join(__dirname,'views'));

app.get("/Generated_Mem_Deck", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  res.sendFile(path.resolve(__dirname, "./views", "index.html"));
});

app.post("/Generated_Mem_Deck/RunGA", (req, res) => {
  try {
    ga.SetAmountOfShuffles(req.body);
  } catch (err) {
    res.status(400).send(JSON.stringify({ error: err.message }));
    return;
  }

  let result;
  for (let i = 0; i < ga.numIterations; i++) {
    result = ga.RunGA();
  }
  result = result.replace('"\n', '"');
  result = result.replace('\n"', '"');
  result = result.replace(/\n|\r/g, ",");
  res.send(result);
});

app.post("/Custom_Shuffle_Order/Generate", (req, res) => {
  let result;
  try {
    result = ga.GetCustomOrder(req.body);
  } catch (err) {
    res.status(400).send(JSON.stringify({ error: err.message }));
    return;
  }

  result = result.replace('"\n', '"');
  result = result.replace('\n"', '"');
  result = result.replace(/\n|\r/g, ",");
  res.send(result);
});

app.post("/Generated_Mem_Deck/Alter_Shuffle_Params", (req, res) => {
  ga.SetShuffleParams(req.body);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
