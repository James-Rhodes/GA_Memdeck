const { ga } = require("./src/ga_memdeck");

process.on("message", (message) => {
  const result = RunAndSetGA(message);
  process.send(result);
  process.exit();
});

function RunAndSetGA(data) {
  ga.SetAmountOfShuffles(data);
  return ga.RunGA();
}
