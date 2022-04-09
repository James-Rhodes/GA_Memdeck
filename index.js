const { ga } = require("./src/ga_memdeck");
const gaHandler = require("./src/GARequestHandler").gaHandler;
const express = require("express");
const app = express();
const path = require("path");

//Below allows for post requests to be received as json
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./views")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views", "index.html"));
});

app.post("/Generated_Mem_Deck/RunGA", (req, res) => {
  const uuid = gaHandler.AddGaRequest(req.body);

  res.send({ uuid: uuid });
});

app.post("/Generated_Mem_Deck/GetResults", (req, res) => {
  const result = gaHandler.GetResult(req.body.uuid);
  if (!result) {
    res.send(JSON.stringify({ response: "Still calculating..." }));
    return;
  }

  if (typeof result == "string") {
    res.send(result);
  } else {
    res.send(JSON.stringify(result));
  }
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

// app.post("/Generated_Mem_Deck/Alter_Shuffle_Params", (req, res) => {
//   ga.SetShuffleParams(req.body);
// });

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views", "index.html"));
});

app.listen(process.env.PORT || 8080, () => {
  console.log("listening on port 8080");
});
