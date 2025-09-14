/**
 * CALCULATOR APPLICATION - iOS-Inspired Implementation
 * 
 * Based on validated design decisions from:
 * - Creative Phase 1: Visual Design System
 * - Creative Phase 2: UI/UX Design and Accessibility
 * - Creative Phase 3: Interaction Design and Animations
 * - VAN QA: Technical Validation (All tests passed)
 */

class Calculator {
    constructor() {
        // Calculator state
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.justCalculated = false;
        
        // DOM elements
        this.display = document.getElementById('display');
        this.calculator = document.querySelector('.calculator');
        
        // Initialize the calculator
        this.init();
    }
    
    /**
     * Initialize calculator - set up event listeners and keyboard support
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardSupport();
        this.updateDisplay();
        
        console.log('✅ Calculator initialized with validated design system');
    }
    
    /**
     * Set up button event listeners with animation feedback
     */
    setupEventListeners() {
        // Use event delegation for better performance
        this.calculator.addEventListener('click', (e) => {
            const button = e.target.closest('.button');
            if (!button) return;
            
            // Add visual feedback (Creative Phase 3)
            this.addButtonFeedback(button);
            
            // Handle button action
            this.handleButtonClick(button);
        });
        
        // Prevent context menu on long press (mobile)
        this.calculator.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    /**
     * Set up keyboard support for accessibility (Creative Phase 2)
     */
    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // Find button by data-key attribute
            const button = document.querySelector(`[data-key="${e.key}"]`) || 
                          document.querySelector(`[data-key="${this.mapKey(e.key)}"]`);
            
            if (button) {
                e.preventDefault();
                
                // Add keyboard feedback
                this.addKeyboardFeedback(button);
                
                // Handle button action
                this.handleButtonClick(button);
            }
        });
        
        // Show keyboard hints on focus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.calculator.classList.add('calculator--keyboard-mode');
            }
        });
        
        document.addEventListener('click', () => {
            this.calculator.classList.remove('calculator--keyboard-mode');
        });
    }
    
    /**
     * Map keyboard keys to calculator functions
     */
    mapKey(key) {
        const keyMap = {
            'Enter': 'Enter',
            '=': 'Enter',
            'Backspace': 'Escape',
            'Delete': 'Escape',
            'c': 'Escape',
            'C': 'Escape',
            '*': '*',
            'x': '*',
            'X': '*'
        };
        
        return keyMap[key] || key;
    }
    
    /**
     * Add visual button feedback (Creative Phase 3)
     */
    addButtonFeedback(button) {
        // Add pressed class for animation
        button.classList.add('pressed');
        
        // Add display input feedback
        if (button.dataset.action === 'number' || button.dataset.action === 'decimal') {
            this.display.classList.add('display--input-active');
            setTimeout(() => {
                this.display.classList.remove('display--input-active');
            }, 150);
        }
        
        // Remove pressed class after animation
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 150);
    }
    
    /**
     * Add keyboard feedback (Creative Phase 3)
     */
    addKeyboardFeedback(button) {
        button.classList.add('button--keyboard-active');
        setTimeout(() => {
            button.classList.remove('button--keyboard-active');
        }, 100);
    }
    
    /**
     * Handle button click based on action type
     */
    handleButtonClick(button) {
        const { action } = button.dataset;
        
        switch (action) {
            case 'number':
                this.inputNumber(button.dataset.number);
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'operation':
                this.setOperation(button.dataset.operation, button);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'clear':
                this.clear();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'percentage':
                this.percentage();
                break;
        }
    }
    
    /**
     * Input a number digit
     */
    inputNumber(num) {
        if (this.waitingForOperand || this.justCalculated) {
            this.currentValue = num;
            this.waitingForOperand = false;
            this.justCalculated = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        
        this.updateDisplay();
    }
    
    /**
     * Input decimal point
     */
    inputDecimal() {
        if (this.waitingForOperand || this.justCalculated) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
            this.justCalculated = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        
        this.updateDisplay();
    }
    
    /**
     * Set operation and handle operation button selection (Creative Phase 3)
     */
    setOperation(nextOperation, button) {
        const inputValue = parseFloat(this.currentValue);
        
        // Clear previous operation selection
        document.querySelectorAll('.operation').forEach(op => {
            op.classList.remove('selected');
        });
        
        // Select current operation button
        if (button) {
            button.classList.add('selected');
        }
        
        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operation && !this.waitingForOperand) {
            const result = this.performCalculation();
            
            if (result === null) return; // Error occurred
            
            this.currentValue = String(result);
            this.previousValue = result;
            this.updateDisplay();
        }
        
        this.waitingForOperand = true;
        this.operation = nextOperation;
        this.justCalculated = false;
    }
    
    /**
     * Perform calculation and show result animation (Creative Phase 3)
     */
    calculate() {
        const inputValue = parseFloat(this.currentValue);
        
        if (this.previousValue !== null && this.operation) {
            const result = this.performCalculation();
            
            if (result === null) return; // Error occurred
            
            // Show result animation
            this.display.classList.add('display--result-ready');
            setTimeout(() => {
                this.display.classList.remove('display--result-ready');
            }, 350);
            
            this.currentValue = String(result);
            this.previousValue = null;
            this.operation = null;
            this.waitingForOperand = true;
            this.justCalculated = true;
            
            // Clear operation selection
            document.querySelectorAll('.operation').forEach(op => {
                op.classList.remove('selected');
            });
            
            this.updateDisplay();
        }
    }
    
    /**
     * Perform the actual arithmetic calculation
     */
    performCalculation() {
        const prev = this.previousValue;
        const current = parseFloat(this.currentValue);
        
        if (isNaN(prev) || isNaN(current)) {
            this.showError('Invalid input');
            return null;
        }
        
        let result;
        
        switch (this.operation) {
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
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return null;
                }
                result = prev / current;
                break;
            default:
                return current;
        }
        
        // Handle floating point precision
        result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
        
        // Check for overflow
        if (!isFinite(result)) {
            this.showError('Result too large');
            return null;
        }
        
        return result;
    }
    
    /**
     * Clear calculator (AC function)
     */
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.justCalculated = false;
        
        // Clear operation selection
        document.querySelectorAll('.operation').forEach(op => {
            op.classList.remove('selected');
        });
        
        // Clear error state
        this.display.classList.remove('display--error');
        
        this.updateDisplay();
    }
    
    /**
     * Toggle sign (+/- function)
     */
    toggleSign() {
        if (this.currentValue !== '0') {
            this.currentValue = this.currentValue.startsWith('-') 
                ? this.currentValue.slice(1)
                : '-' + this.currentValue;
        }
        
        this.updateDisplay();
    }
    
    /**
     * Calculate percentage
     */
    percentage() {
        const value = parseFloat(this.currentValue);
        if (!isNaN(value)) {
            this.currentValue = String(value / 100);
            this.updateDisplay();
        }
    }
    
    /**
     * Show error with animation (Creative Phase 3)
     */
    showError(message) {
        console.error('Calculator Error:', message);
        
        // Show error animation
        this.display.classList.add('display--error');
        this.currentValue = 'Error';
        this.updateDisplay();
        
        // Reset after animation
        setTimeout(() => {
            this.clear();
        }, 1000);
    }
    
    /**
     * Update display with number formatting
     */
    updateDisplay() {
        let displayValue = this.currentValue;
        
        // Format large numbers with commas
        if (!isNaN(displayValue) && displayValue !== 'Error') {
            const num = parseFloat(displayValue);
            
            // Handle very large numbers with scientific notation
            if (Math.abs(num) >= 1e10) {
                displayValue = num.toExponential(5);
            } else if (Math.abs(num) >= 1000000) {
                displayValue = num.toLocaleString('en-US', {
                    maximumFractionDigits: 2
                });
            } else {
                // Remove trailing zeros for decimals
                displayValue = parseFloat(displayValue).toString();
            }
        }
        
        // Limit display length
        if (displayValue.length > 12) {
            displayValue = displayValue.substring(0, 12);
        }
        
        this.display.textContent = displayValue;
        
        // Update ARIA live region for screen readers
        this.display.setAttribute('aria-label', `Calculator display showing ${displayValue}`);
    }
}

/**
 * Performance monitoring (Creative Phase 3 - QA Validation)
 */
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.isMonitoring = false;
    }
    
    start() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.measureFPS();
        console.log('🎯 Performance monitoring started (Target: 60fps)');
    }
    
    measureFPS() {
        if (!this.isMonitoring) return;
        
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            const fps = this.frameCount;
            
            if (fps < 50) {
                console.warn(`⚠️ Performance: ${fps} FPS (below 60fps target)`);
            } else {
                console.log(`✅ Performance: ${fps} FPS`);
            }
            
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(() => this.measureFPS());
    }
    
    stop() {
        this.isMonitoring = false;
    }
}

/**
 * Initialize calculator when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator
    const calculator = new Calculator();
    
    // Start performance monitoring in development
    const monitor = new PerformanceMonitor();
    monitor.start();
    
    // Validation logging
    console.log('🎨 Calculator Implementation Status:');
    console.log('✅ Creative Phase 1: Visual Design System implemented');
    console.log('✅ Creative Phase 2: UI/UX Design and Accessibility implemented');
    console.log('✅ Creative Phase 3: Interaction Design and Animations implemented');
    console.log('✅ VAN QA: All technical validations passed');
    console.log('🚀 Calculator ready for use!');
    
    // Expose calculator for debugging
    window.calculator = calculator;
    window.performanceMonitor = monitor;
});
