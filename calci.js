// Get display element
let display = document.getElementById('display');
let memory = 0;

// Show error message on display
function showError(msg) {
  display.value = msg;
}

// Append number to display
function appendNumber(num) {
  display.value += num;
}

// Append operator safely
function appendOperator(op) {
  if (display.value === '') {
    if (op === '-') {
      display.value = '-';
    }
    return;
  }
  let last = display.value.slice(-1);
  if ("+-*/^".includes(last)) return;
  display.value += op;
}

// Append decimal point
function appendDot() {
  let parts = display.value.split(/[\+\-\*\/\^]/);
  if (!parts[parts.length - 1].includes('.')) {
    display.value += '.';
  }
}

// Clear display
function clearDisplay() {
  display.value = '';
}

// MEMORY FUNCTIONS
function memoryClear() {
  memory = 0;
}

function memoryRecall() {
  if (display.value === '' || "+-*/^".includes(display.value.slice(-1))) {
    display.value += memory;
  }
}

function memoryAdd() {
  try {
    memory += evaluate(display.value);
  } catch (e) {
    display.value = 'Error';
  }
}

function memorySubtract() {
  try {
    memory -= evaluate(display.value);
  } catch (e) {
    display.value = 'Error';
  }
}

// Calculator Logic using BODMAS
function calculate() {
  try {
    if (display.value === '') {
      display.value = 'Empty Input';
      return;
    }
    let result = evaluate(display.value);
    display.value = result;
  } catch (e) {
    showError(e);
  }

}

// Evaluate expression using BODMAS
function evaluate(expr) {

  // Convert expression string to tokens
  let tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\^|\(|\))/g);
  if (!tokens) return 0;

  // Function to apply an operator
  function applyOp(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);

    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') {
      if (b === 0) throw "Division by zero";
      return a / b;
    }
    if (op === '^') return Math.pow(a, b);
  }

  // Operator precedence
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
  let values = [];
  let ops = [];

  for (let token of tokens) {
    if (!isNaN(token)) { 
      values.push(token);
    }
    else if (token === '(') {
      ops.push(token);
    }
    else if (token === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        let b = values.pop(), a = values.pop();
        values.push(applyOp(a, b, ops.pop()));
      }
      ops.pop(); 
    }
    else { 
      while (
        ops.length &&
        (precedence[ops[ops.length - 1]] > precedence[token] ||
          (precedence[ops[ops.length - 1]] === precedence[token] && token !== '^'))
      ) {
        let b = values.pop(), a = values.pop();
        values.push(applyOp(a, b, ops.pop()));
      }
      ops.push(token);
    }
  }
  while (ops.length) {
    let b = values.pop(), a = values.pop();
    values.push(applyOp(a, b, ops.pop()));
  }
  if (values.length !== 1 || isNaN(values[0])) {
    throw "Invalid Expression";
  }
  return values[0];
}

// Square Root Function
function squareRoot() {
  try {
    if (display.value === '') return;
    let value = evaluate(display.value);
    if (value < 0) {
      display.value = 'Invalid √';
      return;
    }
    else {
      display.value = Math.sqrt(value);
    }
  } catch (e) {
    showError(e);
  }
}

// Percentage Function
function percentage() {
  if (display.value === '') {
    showError('Empty Input');
    return;
  }
  try {
    let expr = display.value;
    let match = expr.match(/(.*?)([\+\-\*\/])(\d+\.?\d*)$/);
    if (!match) {
      display.value = evaluate(expr) / 100;
      return;
    }
    let base = evaluate(match[1]);
    let percent = parseFloat(match[3]);
    display.value = match[1] + match[2] + (base * percent / 100);

  } catch (e) {
    showError(e);
  }
}


