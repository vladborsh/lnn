(() => {
  let model = initNetwork(4);
  console.log(model);
  console.log('\n');
  let cache = forwardPropagation( model, [4,5,6]);
  cache.z_results.forEach(z => { console.log(z) } );  
  console.log('\n');
  cache.a_results.forEach(a => { console.log(a) } );  
})()

function multiply(a, b) {
  let aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);  // initialize array of rows
  for (let r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (let c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }                                                                                                                                     
  }
  return m;
}

function convertVec2Col(vec) {
  result = [];
  vec.forEach( item => {
    result.push([item]);
  }) 
  return result;
}

function tanh(x) {
  return (Math.exp(x)-Math.exp(-x))/Math.exp(x)+Math.exp(-x)
}

function sigma(x) {
  return 1/1+Math.exp(-x)
}

function sigma_der(x) {
  return sigma(x)(1-sigma(x));
}

function tanh_der() {
  return 1-Math.pow(tanh(x),2);
}

function initLayer(n_neurons, n_inputs, seed, delta) {
  let result = [];
  for (let i = 0; i < n_neurons; i++) {
    let neuron_w = [];
    for (let j = 0; j < n_inputs; j++) {
      neuron_w.push(seed + (Math.random() * delta));
    }
    result.push(neuron_w);
  }
  return result;
}

function initNetwork(n_layers) {
  let result = [];
  for (let i = 0; i < n_layers; i++) {
    result.push(initLayer(3, 3, 0, 1));
  }
  return result;
}

function tanh2Matrix(m) {
  m.forEach( row => {
    row.forEach( elem => {
      elem = tanh(elem);
    })
  })
  return m;
}

function sigma2Matrix(m) {
  m.forEach( row => {
    row.forEach( elem => {
      elem = sigma(elem);
    })
  })
  return m;
}

function forwardPropagation(model, input) {
  let a_results = [];
  let z_results = [];
  var a = input;
  for (let i = 0; i < model.length; i++) {
    let z = multiply(model[i], convertVec2Col(a));
    if (i != model.length-1) {
      a = tanh2Matrix(z);
    } else {
      a = sigma2Matrix(z);
    }
    z_results.push(z);
    a_results.push(a);
  }
  return {
    a_results,
    z_results
  }
}

function backwardPropagation(model, cache, output) {
  var dz, dW;
  for (let i = model.length-1; i > 0; i--) {
    if (i == model.length-1) {
      // dz = 
    } else {
      a = sigma2Matrix(z);
    }
    z_results.push(z);
    a_results.push(a);
  }
  return {
    a_results,
    z_results
  }
}