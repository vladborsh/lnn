(() => {
  let model = initNetwork(3);
  let inputs = [[4,5,6], [3,5,6], [7,5,2], [4,5,6.2], [4,9,8]];
  let outputs = [[0,1,0], [0,0,1], [1,0,0],[0,1,0],[0,0,1]];
  let modelUpd = train(model, inputs, outputs, 0.0001, 0.001);
  let results = process(modelUpd, [6.99,5,2.1]);
  console.log(results);
})()

function multiplyMatrix(a, b) {
  let aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);
  for (let r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); 
    for (let c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; 
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function multiplyMatrixElementWise(a, b) {
  let aNumRows = a.length, aNumCols = a[0].length;
      m = new Array(aNumRows);  
  for (let r = 0; r < aNumRows; ++r) {
    m[r] = new Array(aNumCols); 
    for (let c = 0; c < aNumCols; ++c) {
      m[r][c] = a[r][c] * b[r][c];
    }
  }
  return m;
}

function diffMatrix(a, b) {
  let aNumRows = a.length, aNumCols = a[0].length;
      m = new Array(aNumRows); 
  for (let r = 0; r < aNumRows; ++r) {
    m[r] = new Array(aNumCols); 
    for (let c = 0; c < aNumCols; ++c) {
      m[r][c] = a[r][c] - b[r][c];
    } 
  }
  return m;
}

function sumMatrix(a, b) {
  let aNumRows = a.length, aNumCols = a[0].length;
      m = new Array(aNumRows); 
  for (let r = 0; r < aNumRows; ++r) {
    m[r] = new Array(aNumCols); 
    for (let c = 0; c < aNumCols; ++c) {
      m[r][c] = a[r][c] + b[r][c];
    }
  }
  return m;
}

function transposeMatrix(m) {
  return m[0].map( 
    (col, i) => m.map(row => row[i])
  );
}

function convertVec2Col(vec) {
  result = [];
  vec.forEach( item => {
    result.push([item]);
  }) 
  return result;
}

function sigma(x) {
  return 1/(1+Math.exp(-x))
}

function softmax(col_matrix) {
  let z_exp = 0;
  col_matrix.forEach( row => { 
    row.forEach( el => {
      z_exp += Math.exp(el);
    }) 
  })
  let res = col_matrix.map( (row, i) => { 
    return row.map( (el,j) => {
      return Math.exp(el) / z_exp;
    }) 
  });
  return res;
}

function sigma_der(x) {
  return sigma(x)(1-sigma(x));
}

function tanh_der(x) {
  return 1-Math.pow(Math.tanh(x),2);
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
  return func2Matrix(m,Math.tanh);
}

function sigma_deriv2Matrix(m) {
  return func2Matrix(m,sigma_deriv);
}

function log2Matrix(m) {
  return func2Matrix(m,Math.log);
}

function tanh_deriv2Matrix(m) {
  return func2Matrix(m,tanh_der);
}

function sigma2Matrix(m) {
  return func2Matrix(m,sigma);
}

function func2Matrix(m, fun) {
  return m.map( row => {
    return row.map( el => {
      return fun(el);
    })
  })
}

function process(model, input) {
  var a = input;
  for (let i = 0; i < model.length; i++) {
    let z = multiplyMatrix(model[i], convertVec2Col(a));
    if (i != model.length-1) {
      a = tanh2Matrix(z);
    } else {
      a = softmax(z);
    }
  }
  return a;
}

function forwardPropagation(model, input) {
  let a_results = [];
  let z_results = [];
  var a = input;
  for (let i = 0; i < model.length; i++) {
    let z = multiplyMatrix(model[i], convertVec2Col(a));
    if (i != model.length-1) {
      a = tanh2Matrix(z);
    } else {
      a = softmax(z);
    }
    z_results.push(z);
    a_results.push(a);
  }
  return {
    a_results: a_results,
    z_results: z_results
  }
}

function backwardPropagation(model, cache, output, input) {
  var dz, dW;
  var dw_results = new Array(model.length-1);
  for (let i = model.length-1; i >= 0; i--) {
    if (i == model.length-1) {
      dz = diffMatrix( cache.a_results[i], convertVec2Col(output) );
    } else {
      dz = multiplyMatrixElementWise( 
        tanh_deriv2Matrix(cache.a_results[i]) ,
        multiplyMatrix(dz, transposeMatrix(model[i])), 
      );
    }
    if (i > 1) {
      dW = multiplyMatrix( dz, transposeMatrix(cache.a_results[i-1]) );
    } else {
      dW = multiplyMatrix( dz, transposeMatrix( convertVec2Col(input) ) );      
    }
    dw_results[i] = dW;
  }
  return dw_results;
}

function updateWeights(model, dw_results, learn_rate) {
  return model.map( (layer, i) => {
    return layer.map( (neuron, j) => {
      return neuron.map( (w, k) => {
        return w - learn_rate * dw_results[i][j][k]
      })
    })
  })
}

function calcError(y_hat, y) {
  y = convertVec2Col(y);
  let result = 0;
  for (let i = 0; i < y.length; i++) {
    result += Math.pow((y_hat[i][0] - y[i][0]), 2);
  }
  //console.log(y_hat, y);
  return result / y.length;
}

function train(model, inputs, outputs, learn_rate, expectedError) {
  var iter = 0;
  var error = null;
  const MAX_ITERATIONS = 1000000;
  do {
    actualCost = 0;
    error = 0;
    inputs.forEach( (input, i) => {
      let cache = forwardPropagation(model, input);
      let dw_results = backwardPropagation(model, cache, outputs[i], input);
      model = updateWeights(model, dw_results, learn_rate);
      error += calcError(cache.a_results[cache.a_results.length-1], outputs[i])
    })
    error = error / outputs.length;
    console.log(error);
    iter++;
  } while (expectedError < error && iter < MAX_ITERATIONS);
  return model;
}