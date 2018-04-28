import * as net from './network';
import * as preProc from './processor';
import * as custom from './css/custom.css';
import * as bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css'


const init = () => {
  setListenerToInputDataFile();
  setListenerToOutputDataFile();
  document.addEventListener('trainIterationResults', handleTrainIterationEvent);
}

const generalFactory = {}

const setData = (key, data) => {
  generalFactory[key] = data;
}

const getData = (key) => {
  return generalFactory[key];
}

const handleTrainIterationEvent = (e) => {
  let log = getData('trainModelLog');
  if (!log) {
    log = [];
  }
  let logValue = getPrintModel(e.detail.model);
  logValue = logValue.concat('<br><br>')
  logValue = logValue.concat('<span class="badge badge-info">' + e.detail.error + '</span>');
  logValue = logValue.concat('<br><br>')
  log.push(logValue);
  setData('trainModelLog', log);
}

const setListenerToInputDataFile = () => {
  var inputElement = document.getElementById("inputFile");
  inputElement.addEventListener("change", handleFilesInputData, false);
  function handleFilesInputData() {
    inputElement.nextElementSibling.innerHTML = this.files[0].name;
    readFile(this.files[0], true);
  }
}

const setListenerToOutputDataFile = () => {
  var outputElement = document.getElementById("outputFile");
  outputElement.addEventListener("change", handleFilesOutputData, false);
  function handleFilesOutputData() {
    outputElement.nextElementSibling.innerHTML = this.files[0].name
    readFile(this.files[0], false);
  }
}

const readFile = (file, isInputData) => {
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      if (isInputData) {
        setData('inputFile', evt.target.result);
        checkInboudData();
        document.getElementById("inputDataRowExampleCard").style.display = 'block';
        document.getElementById("inputDataRowExample").innerText = evt.target.result;        
      } else {
        setData('outputFile', evt.target.result);
        checkInboudData();
        document.getElementById("outputDataRowExampleCard").style.display = 'block';        
        document.getElementById("outputDataRowExample").innerText = evt.target.result;        
      }
    };
    reader.onerror = function (evt) {
      console.log("error reading file")
    };
  }
}

const checkInboudData = () => {
  if (!!getData('inputFile') && !!getData('outputFile')) {
    var button = document.getElementById("submitInboutdDataButton")
    button.disabled = false;
  }
}

const getPrintModel = (model) => {
  return model.reduce( (l_total, layer) => {
    return l_total + '<br>[&nbsp;' + layer.reduce( (n_total, neuron) => {
      return n_total + '<br>&nbsp;&nbsp;[ ' + neuron.reduce( (w_total, w) => {
        return (w_total.concat('&nbsp;&nbsp;')).concat(w);
      }, '') + ' ]'
    }, '') + '<br>]'
  }, '')
}

const submitInboutData = () => {
  const result = preProc.preProcessData(getData('inputFile'), getData('outputFile'));
  setData('inputProcessed', result.inputProcessed);
  setData('outputProcessed', result.outputProcessed);
  setData('graduations', result.graduations);
  console.log(result);
  document.getElementById("dataInputCard").style.display = 'none';
  document.getElementById("trainNetworkCard").style.display = 'block';
  getModel();
}

const getModel = () => {
  let networkModel = net.initNetwork(2);
  setData('networkModel', networkModel);
  document.getElementById("networkModel").innerHTML = getPrintModel(networkModel);
}

const train = () => {
  setData('trainModelLog', []);
  let modelUpd = net.train( 
    getData('networkModel'), 
    getData('inputProcessed'), 
    getData('outputProcessed'), 
    0.001, 
    0.001,
    document
  );
  setData('networkModelUpd', modelUpd);
  document.getElementById("networkModel").innerHTML = getPrintModel(modelUpd);
  document.getElementById("trainModeLogCard").style.display = 'block';
  document.getElementById("trainModelLog").innerHTML = (getData('trainModelLog').join());
  var button = document.getElementById("submitInboutdDataButton")
  button.disabled = true;
  var button = document.getElementById("goToTestModelButton")
  button.disabled = false;
}

const goToTestModel = () => {
  document.getElementById("trainNetworkCard").style.display = 'none';
  document.getElementById("testNetworkCard").style.display = 'block';
}

const findMaximumResult = (colmatrix) => {
  var max = 0;
  var index = 0;
  colmatrix.forEach( (row, i) => {
    if ( row[0] > max ) {
      max = row[0];
      index = i;
    }
  })
  return { max, index };
}

const goToResults = (result) => {
  const handledRes = findMaximumResult(result);
  const graduation = getData('graduations')[handledRes.index];
  const percent = Math.round(handledRes.max * 100, 2);
  document.getElementById("resultAlert").innerText = ('' + percent).concat(' % probability - ' + graduation);
  document.getElementById("testNetworkCard").style.display = 'none';
  document.getElementById("resultsCard").style.display = 'block';
}

const testModel = () => {
  const input = [ 
    document.getElementById("mark1").value, 
    document.getElementById("mark2").value, 
    document.getElementById("mark3").value 
  ];
  const model = getData('networkModelUpd')
  const result = net.process(model, input);
  goToResults(result);
}

const tryAgain = () => {
  for (let key in generalFactory ) {
    generalFactory[key] = undefined;
  }
  document.getElementById("inputFile").value = null;
  document.getElementById("outputFile").value = null;
  document.getElementById("resultsCard").style.display = 'none';
  document.getElementById("inputDataRowExampleCard").style.display = 'none';
  document.getElementById("outputDataRowExampleCard").style.display = 'none';
  var button = document.getElementById("submitInboutdDataButton")
  button.disabled = true;
  var button1 = document.getElementById("submitInboutdDataButton")
  button1.disabled = false;
  var button2 = document.getElementById("goToTestModelButton")
  button2.disabled = true;
  document.getElementById("dataInputCard").style.display = 'block';
}

window.testModel = testModel;
window.goToTestModel = goToTestModel;
window.submitInboutData = submitInboutData;
window.train = train;
window.tryAgain = tryAgain;

init();