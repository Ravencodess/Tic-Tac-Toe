const Player = (sign) =>{
    const getSign = () => sign;
    return{
        getSign
    }
}

const gameBoard = (() => {
    const board = ["","","","","","","","",""];

    const setField = (index, sign) =>{
        if(index > board.length) return;
        board[index] = sign
    }

    const getField = (index) =>{
        if(index > board.length) return;
        return board[index]
    }

    const draw = () => !board.includes('')

    const reset = () =>{
        for(let i = 0; i < board.length; i++){
            board[i] = ""
        }
    }
    return{setField, getField, reset, draw}
})()



const gameController = (() =>{
    let isOver = false;
    const playerX = Player('X');
    const playerO = Player('O');
    let currentPlayerSign = playerX.getSign();

    const playRound = (fieldIndex) => {
        if(gameBoard.getField(fieldIndex) !== "" || isOver === true) return;
        gameBoard.setField(fieldIndex, currentPlayerSign);
        if(checkWin(fieldIndex)){
            displayController.setResultMessage(currentPlayerSign);
            isOver = true;
            return;
        }
        if(gameBoard.draw()){
            displayController.setResultMessage('draw');
            isOver = true;
            return;
        }
        swapPlayers()
        displayController.setDisplayMessage(`Player ${currentPlayerSign}'s Turn`);
    }

    const swapPlayers = () =>{
        currentPlayerSign = (currentPlayerSign === playerX.getSign()) ? playerO.getSign(): playerX.getSign();
    }
    
    const checkWin = (fieldIndex) =>{
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        return winConditions.filter(combinations => combinations.includes(fieldIndex))
                            .some(combination => 
                            combination.every(fieldElemet => gameBoard.getField(fieldElemet) === currentPlayerSign));
    }

    const getIsOver = () => isOver;

    const reset = () => {
        currentPlayerSign = playerX.getSign();
        isOver = false;
    };

    return{
        playRound,
        currentPlayerSign,
        getIsOver,
        reset
    }

})()

const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const displayMessage = document.querySelector(".message");
    const restartBtn = document.getElementById("restart");
    fieldElements.forEach(field =>
            field.addEventListener('click', (e) => {
                gameController.playRound(parseInt(e.target.dataset.index));
                updateDisplay();
            }));
    
    const updateDisplay = () => {
        for(let i = 0; i< fieldElements.length; i++){
            fieldElements[i].textContent = gameBoard.getField(i);
        }
    }

    const setResultMessage = (winner) => {
        if(winner === 'draw'){ 
            setDisplayMessage(`It's a Draw!`);
        }else 
            setDisplayMessage(`Player ${winner} wins!`);
        return;
    }

    const setDisplayMessage = (message) => displayMessage.textContent = message;

    const reset = () => {
        gameBoard.reset();
        gameController.reset()
        updateDisplay();
        setDisplayMessage(`Player X's Turn`)
    }
    restartBtn.addEventListener('click', reset)


    return{
        setResultMessage , setDisplayMessage
    }
})()