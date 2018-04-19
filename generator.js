module.exports = {
  generateInputData,
  generateOutputData,
  processOutput,
  appendData,
}

const specialities = ['Humanitarian', 'Natural science', 'Programming'];
const graduations = ['MacDonalds', 'Project management', 'Software engineering'];
const subjectNumber = 3;
const students = ['Bob', 'Nina', 'Kriss', 'Martin', 'Alela', 'Roman', 'Moti', 'Sergio'];

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max));
}

function generateInputData() {
  let singleDataRow;
  const data = [];
  students.forEach((student) => {
    specialities.forEach((speciality) => {
      for (let i = 0; i < subjectNumber; i++)
        data.push({
          student, 
          speciality, 
          mark: getRandomInt(60, 40)
        });
    });
  })
  return data;
}

function generateOutputData() {
  const data = [];
  students.forEach((student) => {
    data.push({
      student, 
      graduations : graduations[getRandomInt(0,graduations.length)]
    });
  });
  return data;
}

function processOutput(output) {
  const graduations_map = {};
  var counter = 0;
  output.sort( (a,b) => {
    if (a.student > b.student) return 1;
    if (a.student < b.student) return -1;
    return 0;
  });
  output.forEach( (el) => {
    if ( graduations_map[el.graduations] === undefined ) {
      graduations_map[el.graduations] = counter;
      counter++;
    }
  });
  return output.map( (el) => {
    let arr = [];
    for ( let i = 0; i < counter; i++ ) arr[i] = 0;
    arr[ graduations_map[el.graduations] ] = 1;
    return arr;
  });
}

function appendData(filename, content) {
  return new Promise((resolve, reject) => {
    fs.appendFile(filename, content, function (err) {
      if (err) reject(err);
      resolve();
    });
  })
}