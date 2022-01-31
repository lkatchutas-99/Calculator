window.onload = () => {
    const buttonContainer = document.querySelector('.button-container');
    
    const buttonText = [
        'AC',   '%',    'sqrt', 'x',
        '7',    '8',    '9',    '/', 
        '4',    '5',    '6',    '+', 
        '1',    '2',    '3',    '-', 
        '0',    '.',    '+/-',  '='
    ];
    
    buttonText.forEach(i => {
            let button = document.createElement('button');
            //let h1 = document.createElement('h1');
            button.classList.add('button');
            button.textContent = i;
            buttonContainer.appendChild(button).cloneNode(true);
    });
    

}