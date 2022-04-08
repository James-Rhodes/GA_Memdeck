const { ga } = require("./src/ga_memdeck");

process.on("message", (message) => {
  try {
    ga.SetAmountOfShuffles(message);
  } catch (err) {
    // console.log(err);
    process.send({ err: err.message });
    return;
  }
  let result = ga.RunGA();
  result = result.replace('"\n', '"');
  result = result.replace('\n"', '"');
  result = result.replace(/\n|\r/g, ",");
  process.send(result);
});
