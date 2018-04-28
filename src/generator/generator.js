const jsonexport = require('jsonexport');
const fs = require('fs');
const path = require('path');

const specialities = ['Humanitarian', 'Natural science', 'Programming'];
const graduations = ['MacDonalds', 'Project management', 'Software engineering'];
const subjectNumber = 3;
const students = ['Bob', 'Nina', 'Kriss', 'Martin', 'Alela', 'Roman', 'Moti', 'Sergio', 'Fabio', 'Santos', 'Hector', 'Jorh'];

var size1 = 4;
var size2 = 10;

(() => {
  let input = generateInputData();
  let output = generateOutputData();
  console.log( output );
  console.log( input );
  jsonExport(input)
  .then( (res) => {
    appendData( 'input.csv', res)
  })
  jsonExport(output)
  .then( (res) => {
    appendData( 'output.csv', res)
  })
})()


function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max));
}

function generateInputData() {
  let singleDataRow;
  const data = [];
  var iter = 0;
  students.forEach((student) => {
    specialities.forEach((speciality, s_i) => {
      var shift = ((iter < size1 && s_i == 0) 
        || (iter >= size1 && iter < size2 && s_i == 1) 
        || (iter >= size2 && s_i == 2) )
        ? 30 : 0;
      for (let i = 0; i < subjectNumber; i++)
        data.push({
          student, 
          speciality, 
          mark: (getRandomInt(60, 10) + shift)
        });
    });
    iter++;
  })
  return data;
}

function generateOutputData() {
  const data = [];
  var iter = 0;
  students.forEach((student) => {
    var g;
    if (iter < size1) g = 0;
    else if (iter >= size1 && iter < size2) g = 1;
    else g = 2;
    data.push({
      student, 
      graduations : graduations[g]
      //graduations : graduations[getRandomInt(0,graduations.length)]
    });
    iter++;
  });
  return data;
}

function appendData(filename, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, (err) => {
      if(err) {
        console.log(err);
        reject(err);
      }
      console.log("The file was saved!");
      resolve();
    });
  })
}

function jsonExport(input) {
  return new Promise((resolve, reject) => {
    jsonexport(input, (err, csv) => {
      if(err) {
        console.log(err);
        reject(err);
      } 
      console.log(csv);
      resolve(csv);
    });
  })
}