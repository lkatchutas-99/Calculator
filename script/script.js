window.onload = () => {
    const buttonContainer = document.querySelector('.button-container');
    const numberDisplay = document.querySelector('.number-display');

    const divideByZeroMessages = [
        "Did you divide by zero? That's a strike, 3 strikes and you're banned",
        "Cannot divide by zero",
        'Dividing by zero makes no sense',
        'Are you trying to crash my website?',
        "Can't you choose something else besides zero after /?",
        "Do that to your own calculator and see how it feels",
        "That ain't possible my friend",
        "I suggest you learn division"
    ];

    const buttonText = [
        'AC',   'Del', '%',     'x',
        '7',    '8',   '9',     '/', 
        '4',    '5',   '6',     '-', 
        '1',    '2',   '3',     '+', 
        '+/-',  '0',   '.',     '='
    ];

    const data = {
        operator: '',
        displayValue: '',
        firstNum: 0.0,
        secondNum: 0.0,
        result: 0.0,
        isEquationCalculatable: false
    };

    createButtons();

    // set all buttons
    const button = Array.from(document.querySelectorAll('.button'));

    // set numbered buttons
    const numberButtons = button.filter(i => isNumberOrPeriod(i.value));
    
    // set non-numbered buttons not including =
    const nonNumberedButtons = button.filter(i => !isNumberOrPeriod(i.value) && i.value !== '=');

    // set equal button
    const equalButton = button.find(i => i.value === '=');
    
    // print numbered buttons on click
    numberButtons.forEach(i => {
        i.addEventListener('click', e => concatToDisplay(e.target.value));
    });

    // 
    window.addEventListener('keydown', keyPressed);

    nonNumberedButtons.forEach(i => {
        i.addEventListener('click', e => nonNumberedPressed(e.target));
    })

    equalButton.addEventListener('click', equalButtonPressed);

    // Create calculator buttons
    function createButtons() {
        buttonText.forEach(i => {
            let currentButton = document.createElement('button');
            currentButton.classList.add('button');
            currentButton.value = i == 'x' ? '*' : i;
            currentButton.textContent = i;
            buttonContainer.appendChild(currentButton).cloneNode(true);
        });
    }

    
    // check if number or period was pressed
    function isNumberOrPeriod(val) {
        return !isNaN(parseFloat(val)) || val === '.';
    }

    // do something to typed key
    function keyPressed(event) {
        if (isNumberOrPeriod(event.key))
        {
            concatToDisplay(event.key);
        }
        else if (event.key === 'Enter' || event.key === '=') {
            equalButtonPressed(event.key);
        }
        else if (event.key === 'Backspace') {
            backspace();
        }
        else {
            nonNumberedButtons.forEach(i => {
                if (i.value === event.key) {
                     nonNumberedPressed(i);
                 }
             })
        }
    } 
    
    // change button color on hover
    function hoverButton() {
        this.style.backgroundColor = '#d0d0d7'
    }

    // reset button on mouseout
    function unHoverButton() {
        this.style.backgroundColor = '#e9e9ed';
    }

    function removeHoverEffect () {
        nonNumberedButtons.forEach(i => {
            if (i.value === '+' || i.value === '-' || i.value === '*' || i.value === '/')
            {
                i.removeEventListener('mouseover', hoverButton);
                i.removeEventListener('mouseout', unHoverButton);
            }
        });
    }

    function addHoverEffect() {
        nonNumberedButtons.forEach(i => {
            i.style.backgroundColor = '#e9e9ed'
            i.addEventListener('mouseover', hoverButton);
            i.addEventListener('mouseout', unHoverButton);
        })
    }

    // add new values to display
    function concatToDisplay(val) {
        if ((val !== '.' || !data.displayValue.includes('.')) && data.displayValue.length < 15) {
            numberDisplay.style.color = 'black';
            addHoverEffect();
            data.displayValue += val;
            
            changeClearButton('C')
        }
        putDisplay(data.displayValue);
    }

    // put to display
    function putDisplay (num) {
        numberDisplay.textContent = num;
    }

    // remove last value
    function backspace()
    {
        data.displayValue = data.displayValue.slice(0, -1);
        
        if (!data.displayValue) {
            data.isSecondNumSetable = false;
            changeClearButton('AC');
        }
        putDisplay(data.displayValue);
    }

    // add two numbers
    function add(num1, num2) {
        return num1 + num2;
    }

    // subtract two numbers
    function subtract(num1, num2) {
        return num1 - num2;
    }

    // multiply two numbers
    function multiply(num1, num2) {
        return num1 * num2;
    }

    // divide two numbers (fool proof)
    function divide (num1, num2) {
        if (num2 === 0) {
            let message = Math.floor(Math.random() * divideByZeroMessages.length);
            return divideByZeroMessages[message];
        }
        return num1 / num2;
    }

    // get result of calculation
    function operate() {
        
        if (data.operator === '+') {
            data.result = add(data.firstNum, data.secondNum);
        }
        else if (data.operator === '-') {
            data.result = subtract(data.firstNum, data.secondNum);
        }
        else if (data.operator === '*') {
            data.result = multiply(data.firstNum, data.secondNum);
        }
        else if (data.operator === '/') {
            data.result = divide(data.firstNum, data.secondNum);
        }

        if (!isNaN(parseFloat(data.result))) {
            data.result = parseFloat(data.result.toFixed(5));
        }
    }

    // Percentage button pressed
    function percentage (num) {
        return divide(num, 100);
    }

    // Clear display
    function clear() {
        data.firstNum = 0;
        data.secondNum = 0;
        data.displayValue = '';
        removeHoverEffect();
        changeClearButton('AC');
        putDisplay('');
    }

    // Change clear button text
    function changeClearButton (val)
    {
        nonNumberedButtons[0].textContent = val;
    }

    // Calculate
    function calculate() {
        
        data.secondNum = parseFloat(numberDisplay.textContent);
            
        operate();
            
        putDisplay(data.result);

        data.firstNum = data.result;
        data.displayValue = '';
    }

    // calculate if equal is pressed
    function equalButtonPressed(){
        if (data.isSecondNumSetable)
        {
            calculate();
            data.isSecondNumSetable = false;
        }
    }

    // If an operator is pressed (+-*/% +/-)
    function operatorPressed(event) {
        if (event.value === '%') {
            putDisplay(percentage(parseFloat(numberDisplay.textContent)));
        }
        else if (event.value === '+/-') {
            putDisplay(multiply(parseFloat(numberDisplay.textContent), -1))
        }
        else {
            numberDisplay.style.color = 'rgba(0, 0, 0, 0.5)';
            event.style.backgroundColor = 'orange';
            removeHoverEffect();

            if (data.isSecondNumSetable) {
                calculate();
            }
    
            data.firstNum = parseFloat(numberDisplay.textContent);
            data.operator = event.value;

            putDisplay(data.firstNum);

            data.displayValue = '';
            data.isSecondNumSetable = true;
        }
    }

    // If a non numbered is pressed
    function nonNumberedPressed(event) {
        if (event.value === 'AC') {
            clear();
        }
        else if (event.value === 'Del') {
            backspace();
        }
        else if (numberDisplay.textContent !== '' && numberDisplay.textContent !== 'Must Enter Value') {
            operatorPressed(event);
        }
        else {
            putDisplay('Must Enter Value');
        }
    }
}