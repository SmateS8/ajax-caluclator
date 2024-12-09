import React, { useState, useEffect } from 'react';
const backendUrl = import.meta.env.PUBLIC_EXPRESS_BACKEND_URL || 'http://localhost:3000';

const Calculator = () => {


  const [display, setDisplay] = useState('0');
  const [currentInput, setCurrentInput] = useState('0');
  const [operator, setOperator] = useState(null);
  const [previousInput, setPreviousInput] = useState(null);
  const [keyPressData, setKeyPressData] = useState({});

  useEffect(() => {
    fetchKeyPressData();
    alert("HELLO");
  }, []);

  const clearDisplay = () => {
    setCurrentInput('0');
    setOperator(null);
    setPreviousInput(null);
    updateDisplay('0');
  };

  const appendNumber = (number) => {
    const newInput = currentInput === '0' ? number.toString() : currentInput + number.toString();
    setCurrentInput(newInput);
    updateDisplay(newInput);
    recordButtonPress(number);
  };

  const appendOperator = (op) => {
    if (operatore !== null) {
      calculate();
    }
    setOperator(op);
    setPreviousInput(currentInput);
    setCurrentInput('0');
  };

  const appendDot = () => {
    if (!currentInput.includes('.')) {
      const newInput = currentInput + '.';
      setCurrentInput(newInput);
      updateDisplay(newInput);
    }
  };

  const calculate = () => {
    if (operator === null || previousInput === null) {
      return;
    }
    const prevd = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = prev / current;
        break;
      default:
        return;
    }
    const newInput = result.toString();
    setCurrentInput(newInput);
    setOperator(null);
    setPreviousInput(null);
    updateDisplay(newInput);
  };

  const updateDisplay = (value) => {
    setDisplay(value);
  };

  const recordButtonPress = async (button) => {
    if (!isNaN(button)) {
      try {
        const response = await fetch(`${backendUrl}/numberPressed/${button}`);
        const data = await response.text();
        console.log(data);
        fetchKeyPressData(); // Refresh the table data
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const fetchKeyPressData = async () => {
    try {
      const response = await fetch(`${backendUrl}/getNumbers`);
      const data = await response.json();
      setKeyPressData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="calculator">
        <div className="display">{display}</div>
        <div className="buttons">
          <button className="button" onClick={clearDisplay}>C</button>
          <button className="button operator" onClick={() => appendOperator('/')}>÷</button>
          <button className="button operator" onClick={() => appendOperator('*')}>×</button>
          <button className="button operator" onClick={() => appendOperator('-')}>−</button>
          <button className="button number" onClick={() => appendNumber(7)}>7</button>
          <button className="button number" onClick={() => appendNumber(8)}>8</button>
          <button className="button number" onClick={() => appendNumber(9)}>9</button>
          <button className="button operator" onClick={() => appendOperator('+')}>+</button>
          <button className="button number" onClick={() => appendNumber(4)}>4</button>
          <button className="button number" onClick={() => appendNumber(5)}>5</button>
          <button className="button number" onClick={() => appendNumber(6)}>6</button>
          <button className="button equals" onClick={calculate}>=</button>
          <button className="button number" onClick={() => appendNumber(1)}>1</button>
          <button className="button number" onClick={() => appendNumber(2)}>2</button>
          <button className="button number" onClick={() => appendNumber(3)}>3</button>
          <button className="button number zero" onClick={() => appendNumber(0)}>0</button>
          <button className="button dot" onClick={appendDot}>.</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Press Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(keyPressData).map(([key, count]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calculator;