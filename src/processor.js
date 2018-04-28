import * as csvtojson from 'csvtojson';

export {
  preProcessData
}

const specialities = ['Humanitarian', 'Natural science', 'Programming'];
const graduations = ['MacDonalds', 'Project management', 'Software engineering'];

function preProcessData(input, output) {
  return processInputOutput( processCsv(input), processCsv(output) )
}

function processCsv(str) {
  const result = [];
  const rows = str.split('\n');
  var fields = [];
  var headerRow = true;
  rows.forEach( row => {
    let cols = row.split(',')
    if ( headerRow ) {
      fields = cols;
      headerRow = false;
    } else {
      let rowItem = {}
      var counter = 0;
      cols.forEach( col => {
        rowItem[fields[counter++]] = col;
      })
      result.push(rowItem);
    }
  })
  console.log(result)
  return result;
}

function processInputOutput(input, output) {
  const graduations_map = {};
  let outputProcessed = null;
  let inputProcessed = [];
  let students = {};
  var counter = 0;
  output.forEach((el) => {
    if (graduations_map[el.graduations] === undefined) {
      graduations_map[el.graduations] = counter;
      counter++;
    }
  });
  console.log(graduations_map);
  input.forEach((el) => {
    if (students[el.student] === undefined) {
      students[el.student] = {};
    }
  });
  for (let st in students) {
    specialities.forEach(spec => {
      students[st][spec] = 0;
    })
  }
  input.forEach((el) => {
    students[el.student][el.speciality] += parseFloat(el.mark);
  });
  for (let st in students) {
    const inputProcessedRow = [];
    specialities.forEach(spec => {
      students[st][spec] = parseFloat((students[st][spec] / specialities.length).toFixed(2));
      inputProcessedRow.push(students[st][spec]);
    })
    inputProcessed.push(inputProcessedRow);
  }
  outputProcessed = output.map((el) => {
    let arr = [];
    for (let i = 0; i < graduations.length; i++) arr[i] = 0;
    arr[graduations_map[el.graduations]] = 1;
    return arr;
  });
  return {
    inputProcessed,
    outputProcessed,
    graduations,
  }
}