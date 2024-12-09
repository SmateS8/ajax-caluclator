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
  }, []);

  const fetchKeyPressData = async () => {
    try {
      const response = await fetch(`${backendUrl}/getNumbers`);
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      setKeyPressData(data.buttons || {});
    } catch (error) {
      console.error('Error fetching key press data:', error);
    }
  };

  const recordButtonPress = async (button) => {
    if (!isNaN(button)) {
      try {
        const response = await fetch(`${backendUrl}/numberPressed/${button}`);
        if (response.ok) {
          fetchKeyPressData(); // Refresh statistics
        } else {
          console.error('Error recording button press');
        }
      } catch (error) {
        console.error('Error recording button press:', error);
      }
    }
  };

  const updateDisplay = (value) => {
    setDisplay(value.toString());
  };

  const handleNumber = (number) => {
    recordButtonPress(number);
    const newInput = currentInput === '0' ? number.toString() : currentInput + number.toString();
    setCurrentInput(newInput);
    updateDisplay(newInput);
  };

  const handleOperator = (op) => {
    if (operator && previousInput !== null) {
      performCalculation();
    } else {
      setPreviousInput(currentInput);
    }
    setOperator(op);
    setCurrentInput('0');
  };

  const performCalculation = () => {
    if (operator && previousInput !== null) {
      const prev = parseFloat(previousInput);
      const current = parseFloat(currentInput);
      let result = 0;

      switch (operator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          result = prev / current;
          break;
        default:
          return;
      }

      setCurrentInput(result.toString());
      updateDisplay(result.toString());
      setPreviousInput(result.toString());
      setOperator(null);
    }
  };

  const handleEquals = () => {
    if (operator && previousInput !== null) {
      performCalculation();
    }
  };

  const handleClearEntry = () => {
    setCurrentInput('0');
    updateDisplay('0');
  };

  const handleClear = () => {
    setCurrentInput('0');
    setOperator(null);
    setPreviousInput(null);
    updateDisplay('0');
  };

  const handleBackspace = () => {
    if (currentInput.length > 1) {
      const newInput = currentInput.slice(0, -1);
      setCurrentInput(newInput);
      updateDisplay(newInput);
    } else {
      setCurrentInput('0');
      updateDisplay('0');
    }
  };

  const handleDecimal = () => {
    if (!currentInput.includes('.')) {
      const newInput = currentInput + '.';
      setCurrentInput(newInput);
      updateDisplay(newInput);
    }
  };

  const handlePercent = () => {
    const value = parseFloat(currentInput) / 100;
    setCurrentInput(value.toString());
    updateDisplay(value.toString());
  };

  const handleSpecialOperation = (op) => {
    let value = parseFloat(currentInput);
    switch (op) {
      case '1/x':
        value = 1 / value;
        break;
      case 'x²':
        value = value ** 2;
        break;
      case '√x':
        value = Math.sqrt(value);
        break;
      case '±':
        value = -value;
        break;
      default:
        break;
    }
    setCurrentInput(value.toString());
    updateDisplay(value.toString());
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">{display}</div>
        <div className="buttons">
          <button onClick={handlePercent}>%</button>
          <button onClick={handleClearEntry}>CE</button>
          <button onClick={handleClear}>C</button>
          <button onClick={handleBackspace}>⌫</button>
          <button onClick={() => handleSpecialOperation('1/x')}>1/x</button>
          <button onClick={() => handleSpecialOperation('x²')}>x²</button>
          <button onClick={() => handleSpecialOperation('√x')}>√x</button>
          <button onClick={() => handleOperator('÷')}>÷</button>
          <button onClick={() => handleNumber(7)} className="number-button">7</button>
          <button onClick={() => handleNumber(8)} className="number-button">8</button>
          <button onClick={() => handleNumber(9)} className="number-button">9</button>
          <button onClick={() => handleOperator('×')}>×</button>
          <button onClick={() => handleNumber(4)} className="number-button">4</button>
          <button onClick={() => handleNumber(5)} className="number-button">5</button>
          <button onClick={() => handleNumber(6)} className="number-button">6</button>
          <button onClick={() => handleOperator('-')}>-</button>
          <button onClick={() => handleNumber(1)} className="number-button">1</button>
          <button onClick={() => handleNumber(2)} className="number-button">2</button>
          <button onClick={() => handleNumber(3)} className="number-button">3</button>
          <button onClick={() => handleOperator('+')}>+</button>
          <button onClick={() => handleSpecialOperation('±')}>±</button>
          <button onClick={() => handleNumber(0)} className="number-button">0</button>
          <button onClick={handleDecimal}>.</button>
          <button id="equals" onClick={handleEquals}>=</button>
        </div>
      </div>
      <div className="statistics">
        <h2>Button Press Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Button</th>
              <th>Press Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(keyPressData).map(([button, count]) => (
              <tr key={button}>
                <td>{button}</td>
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