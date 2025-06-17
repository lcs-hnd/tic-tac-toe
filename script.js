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

    const getBoard = () => board; 

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
        getBoard,
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

function boardControl() {
    const GAME_STATE = {
        IN_PROGRESS: 'IN_PROGRESS',
        WIN: 'WIN',
        DRAW: 'DRAW'
    };

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

    const getGameState = (board) => {
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

        const boardValues = board.getBoard().flat().map(cell => cell.checkCellSymbol());

        for(const line of winConditions) {
            const [a, b, c] = line;
                
            if (boardValues[a] !== '[ ]' && boardValues[a] === boardValues[b] && boardValues[a] === boardValues[c]) {
                return {
                    status: GAME_STATE.WIN,
                    winner: boardValues[a],
                    winningLine: line
                };
            }
        }

        const isDraw = board.getBoard().flat().every(cell => cell.checkCellState());
        if (isDraw) {
            return { status: GAME_STATE.DRAW };
        }
            
        return { status: GAME_STATE.IN_PROGRESS };
    };

    const playRound = (row, column) => {
        const symbol = activePlayer.symbol;

            if (board.addSymbol(row, column, symbol)) {
                const gameState = getGameState(board);
                
                switch (gameState.status) {
                    case GAME_STATE.WIN:
                        board.printBoard();
                        console.log(`${gameState.winner} is the winner!`);
                        break;

                    case GAME_STATE.DRAW:
                        board.printBoard();
                        console.log('The game is a draw!');
                        break;

                    case GAME_STATE.IN_PROGRESS:
                        switchPlayerTurn();
                        board.printBoard();
                        break;
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