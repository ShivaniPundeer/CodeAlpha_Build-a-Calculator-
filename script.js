const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousValue = null;
let currentOperator = null;
let expressionText = '';
let justEvaluated = false;

const operatorSymbols = {
  add: '+',
  subtract: '\u2212',
  multiply: '\u00d7',
  divide: '\u00f7'
};

function updateDisplay() {
  resultEl.textContent = currentInput;
  expressionEl.textContent = expressionText;
}

function inputDigit(digit) {
  if (justEvaluated) {
    currentInput = digit === '.' ? '0.' : digit;
    expressionText = '';
    justEvaluated = false;
    updateDisplay();
    return;
  }
  if (digit === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && digit !== '.') {
    currentInput = digit;
  } else {
    currentInput += digit;
  }
  updateDisplay();
}

function setOperator(action) {
  if (currentOperator && previousValue !== null && !justEvaluated) {
    calculate();
  }
  previousValue = parseFloat(currentInput);
  currentOperator = action;
  expressionText = `${formatNumber(previousValue)} ${operatorSymbols[action]}`;
  justEvaluated = false;
  currentInput = '0';
  updateDisplay();
}

function calculate() {
  if (currentOperator === null || previousValue === null) return;
  const current = parseFloat(currentInput);
  let result;

  switch (currentOperator) {
    case 'add':
      result = previousValue + current;
      break;
    case 'subtract':
      result = previousValue - current;
      break;
    case 'multiply':
      result = previousValue * current;
      break;
    case 'divide':
      result = current === 0 ? NaN : previousValue / current;
      break;
    default:
      return;
  }

  expressionText = `${formatNumber(previousValue)} ${operatorSymbols[currentOperator]} ${formatNumber(current)} =`;
  currentInput = Number.isNaN(result) ? 'Error' : formatNumber(result);
  previousValue = null;
  currentOperator = null;
  justEvaluated = true;
  updateDisplay();
}

function formatNumber(num) {
  if (!isFinite(num)) return 'Error';
  const rounded = Math.round(num * 1e10) / 1e10;
  return rounded.toString();
}

function clearAll() {
  currentInput = '0';
  previousValue = null;
  currentOperator = null;
  expressionText = '';
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
}

function percent() {
  currentInput = formatNumber(parseFloat(currentInput) / 100);
  updateDisplay();
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      clearAll();
      break;
    case 'delete':
      deleteLast();
      break;
    case 'percent':
      percent();
      break;
    case 'equals':
      calculate();
      break;
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      setOperator(action);
      break;
  }
}

function flashButton(btn) {
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    flashButton(btn);
    const { value, action } = btn.dataset;
    if (value !== undefined) {
      inputDigit(value);
    } else if (action) {
      handleAction(action);
    }
  });
});

// Keyboard support
document.addEventListener('keydown', e => {
  const key = e.key;
  const keyToAction = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    'Enter': 'equals',
    '=': 'equals',
    'Backspace': 'delete',
    'Escape': 'clear',
    '%': 'percent'
  };

  if (/^[0-9]$/.test(key) || key === '.') {
    inputDigit(key);
    highlightKey(key === '.' ? '.' : key);
  } else if (keyToAction[key]) {
    e.preventDefault();
    handleAction(keyToAction[key]);
    highlightKey(key);
  }
});

function highlightKey(key) {
  const actionMap = { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide', 'Enter': 'equals', '=': 'equals', 'Backspace': 'delete', 'Escape': 'clear', '%': 'percent' };
  const action = actionMap[key];
  let btn;
  if (action) {
    btn = document.querySelector(`[data-action="${action}"]`);
  } else {
    btn = document.querySelector(`[data-value="${key}"]`);
  }
  if (btn) flashButton(btn);
}

updateDisplay();
