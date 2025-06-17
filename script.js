'use strict';

function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    
    for (let i = 0; i < rows; i++) {
        board.push([]);
        for (let j = 0; j < columns; j ++) {
            board[i].push(cellState());
        }
    }

    const boardState = () => board; 

    const addSymbol = (row, column, symbol) => {
        const target = board[row][column];
        if(!target.checkCellState()) {
            board[row][column].addPlayerSymbol(symbol); 
            return true
        } else {  
            console.log('Cell taken.')
            return false
        }
    }

    const printBoard = () => {
        const boardValues = board.map(row => row.map(cell => cell.checkCellSymbol()));
        console.log(boardValues[0]);
        console.log(boardValues[1]);
        console.log(boardValues[2]);
    };

    return {
        boardState,
        addSymbol,
        printBoard,
    }
};

function cellState() {
    let playerOccupied = false;
    let playerSymbol = '[ ]';

    const checkCellState = () => {
        return playerOccupied; 
    };

    const checkCellSymbol = () => {
            return playerSymbol;
    };

    const addPlayerSymbol = (symbol) => { 
        playerSymbol = symbol;
        playerOccupied = true;
    };
    
    return {
        addPlayerSymbol,
        checkCellState,
        checkCellSymbol,
    }
};

function boardControl(row, column) {
    const players = [
        {   
            name: 'Player 1',
            symbol: 'X', 
            // color: 'Red',

        },
        {
            name: 'Player 2',
            symbol: 'O',
            // color: 'Blue',
        }
    ];

    let board = gameBoard();
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
       activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const checkForWin = (board) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ];
        
        const boardValues = board.boardState().flat().map(cell => cell.checkCellSymbol());

        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];

            if (boardValues[a] !== '[ ]' && boardValues[a] === boardValues[b] && boardValues[b] === boardValues[c]){
                return { winningSymbol:boardValues[a] };
            }
        }
        return null;
    };

    const checkForDraw = (board) => {
        const allCells = board.boardState().flat();
        return allCells.every(cell => cell.checkCellState());
    };

    const playRound = (row, column) => {
        const symbol = activePlayer.symbol;

            if (board.addSymbol(row, column, symbol)) {
                const winResult = checkForWin(board);
                if (winResult){
                    console.log(`${activePlayer.name} with the ${winResult.winningSymbol} symbol has won!`)
                } else if (checkForDraw(board)) {
                    board.printBoard();
                    console.log('Draw.')
                } else {
                    switchPlayerTurn();
                    board.printBoard();
                }
            }
    };

    const restartGame = () => {
        console.log('---NEW GAME---');
        activePlayer = players[0];
        board = gameBoard();
    };

    return { playRound, restartGame }
};

const game = boardControl();

