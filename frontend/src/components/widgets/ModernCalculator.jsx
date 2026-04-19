import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import './ModernCalculator.css';

const ModernCalculator = ({ isOpen, onClose }) => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    if (!isOpen) return null;

    const handleNum = (num) => {
        if (display === '0' || display === 'Error') {
            setDisplay(num);
        } else {
            setDisplay(display + num);
        }
    };

    const handleOp = (op) => {
        setEquation(display + ' ' + op + ' ');
        setDisplay('0');
    };

    const handleClear = () => {
        setDisplay('0');
        setEquation('');
    };

    const handleEqual = () => {
        try {
            // Very basic sanitized eval for a visual dummy calculator
            const fullEquation = equation + display;
            const evalResult = eval(fullEquation.replace(/[^-()\d/*+.]/g, ''));
            
            // Format to avoid long decimals
            const result = Math.round(evalResult * 10000) / 10000;
            setDisplay(String(result));
            setEquation('');
        } catch (error) {
            setDisplay('Error');
            setEquation('');
        }
    };

    return (
        <div className="calc-overlay fade-in" onClick={onClose}>
            <div className="calc-container slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="calc-header">
                    <div className="calc-title">
                        <Calculator size={16} /> Quick Calc
                    </div>
                    <button className="calc-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                
                <div className="calc-screen">
                    <div className="calc-equation">{equation}</div>
                    <div className="calc-display">{display}</div>
                </div>

                <div className="calc-keypad">
                    <button className="calc-btn op-btn" onClick={handleClear}>C</button>
                    <button className="calc-btn op-btn" onClick={() => handleOp('(')}>(</button>
                    <button className="calc-btn op-btn" onClick={() => handleOp(')')}>)</button>
                    <button className="calc-btn op-btn highlight" onClick={() => handleOp('/')}>÷</button>

                    <button className="calc-btn num-btn" onClick={() => handleNum('7')}>7</button>
                    <button className="calc-btn num-btn" onClick={() => handleNum('8')}>8</button>
                    <button className="calc-btn num-btn" onClick={() => handleNum('9')}>9</button>
                    <button className="calc-btn op-btn highlight" onClick={() => handleOp('*')}>×</button>

                    <button className="calc-btn num-btn" onClick={() => handleNum('4')}>4</button>
                    <button className="calc-btn num-btn" onClick={() => handleNum('5')}>5</button>
                    <button className="calc-btn num-btn" onClick={() => handleNum('6')}>6</button>
                    <button className="calc-btn op-btn highlight" onClick={() => handleOp('-')}>−</button>

                    <button className="calc-btn num-btn" onClick={() => handleNum('1')}>1</button>
                    <button className="calc-btn num-btn" onClick={() => handleNum('2')}>2</button>
                    <button className="calc-btn num-btn" onClick={() => handleNum('3')}>3</button>
                    <button className="calc-btn op-btn highlight" onClick={() => handleOp('+')}>+</button>

                    <button className="calc-btn num-btn span-2" onClick={() => handleNum('0')}>0</button>
                    <button className="calc-btn num-btn" onClick={() => handleNum('.')}>.</button>
                    <button className="calc-btn equal-btn" onClick={handleEqual}>=</button>
                </div>
            </div>
        </div>
    );
};

export default ModernCalculator;
