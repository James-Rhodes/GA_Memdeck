const ga = require('./build/Release/ga.node');

for(let i = 0; i<100; i++){
    const result = ga.RunGA();

    console.log(result);
}