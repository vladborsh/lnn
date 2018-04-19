const net = require('./network');
const gen = require('./generator');

// let model = initNetwork(3);
// console.log(model);
// let inputs = [[4,5,6], [3,5,6], [7,5,2], [4,5,6.2], [4,9,8]];
// let outputs = [[0,1,0], [0,0,1], [1,0,0], [0,1,0], [0,0,1]];
// let modelUpd = train(model, inputs, outputs, 0.001, 0.001);
// let results = process(modelUpd, [6.99,5,2.1]);

let output = gen.generateOutputData();
console.log( output );
console.log( gen.processOutput(output) );
