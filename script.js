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

    const board = gameBoard();
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
       activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const playRound = (row, column) => {
        symbol = activePlayer.symbol;

        if (board.addSymbol(row, column, symbol)) {
            switchPlayerTurn();
            board.printBoard();
        } 
    };
    return { playRound }
}

console.log(gameBoard().printBoard())
const game = boardControl();