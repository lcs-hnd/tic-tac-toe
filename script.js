'use strict';

// factory function called upon to create the board instance every game
function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    
    // nested for loops used to create the 2D grid 
    for (let i = 0; i < rows; i++) {
        // row arrays pushed into main board array
        board.push([]);
        // inner loop pushes into each previous array objects created by the cellState factory
        for (let j = 0; j < columns; j ++) {
            board[i].push(cellState());
        }
    }

    // arrow function used to attain the main board array [[{},{},{}],[{},{},{}],[{},{},{}]]
    const getBoard = () => board; 

    // modifies specific objects within board
    const addSymbol = (row, column, symbol) => {
        // targets the object through bracket notation
        const target = board[row][column];
        // given specific object's checkCellState outcome isn't falsy proceed
        if(!target.checkCellState()) {
            // reach into board array for a specific object and call one of its function with passed argument
            // to change the current symbol definition 
            board[row][column].addPlayerSymbol(symbol);
            return true
        } else {  
            return false
        }
    }

    return {
        getBoard,
        addSymbol
    }
};

// factory function creating the cellObject and revealing functions used to determine its state
function cellState() {
    let playerOccupied = false;
    let playerSymbol = '[ ]';

    const checkCellState = () => {
        return playerOccupied; 
    };

    const checkCellSymbol = () => {
            return playerSymbol;
    };

    // used for restarting the game
    const clearSymbols = () => {
        playerSymbol = '[ ]';
        playerOccupied = false;
    };

    // adds symbol based on current cell state declares it occupied
    const addPlayerSymbol = (symbol) => { 
        playerSymbol = symbol;
        playerOccupied = true;
    };
    
    return {
        addPlayerSymbol,
        checkCellState,
        checkCellSymbol,
        clearSymbols
    }
}

// factory function to control instance from gameBoard with DC
function boardControl() {
    // GAME_STATE object declared with possible state properties for readability
    const GAME_STATE = {
        IN_PROGRESS: 'IN_PROGRESS',
        WIN: 'WIN',
        DRAW: 'DRAW'
    };

    // players array declared with two objects each with symbol and name properties
    const players = [
        { name: 'Player 1', symbol: 'X' },
        { name: 'Player 2', symbol: 'O'}
    ];

    // direction composition : board declared as an instance from gameBoard() factory function
    let board = gameBoard();
    let activePlayer = players[0];

    // expose the current player
    const getActivePlayer = () => activePlayer;

    // attain the board array and flatten it to one array of objects and run their method clearSymbols on all of them
    const restartGame = () => {
        board.getBoard().flat().map(cell => cell.clearSymbols());

        // take care of player icon dimming and move turn back to player 1
        activePlayer = players[0];
    };

    // arrow function for switching the turns
    const switchPlayerTurn = () => {
        // activePlayer defined with ternary operator with the condition that activePlayer is the first playerObject 
        // in the array players else go to the second
       activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    // arrow function used to determine win/draw/in-progress
    const getGameState = (board) => {
        // all winning lines
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

        // turn all cellObjects into their current symbols 
        const boardValues = board.getBoard().flat().map(cell => cell.checkCellSymbol());

        // loop through each array in winConditions
        for(const line of winConditions) {
            // array destructuring winConditions
            const [a, b, c] = line;
            
            // given no empty cell and all cell symbols match declare a winner and the winning line 
            if (boardValues[a] !== '[ ]' && boardValues[a] === boardValues[b] && boardValues[a] === boardValues[c]) {
                return {
                    status: GAME_STATE.WIN,
                    winner: boardValues[a],
                    winningLine: line
                };
            }
        }

        // define a boolean : turns true when all cellOjects return a player occupied state
        const isDraw = board.getBoard().flat().every(cell => cell.checkCellState());

        // when true declare a draw
        if (isDraw) {
            return { 
                status: GAME_STATE.DRAW
            };
        }
        
        // return game in progess in status if nothing else
        return { 
            status: GAME_STATE.IN_PROGRESS 
        };
    };

    // run through a round after called
    const playRound = (row, column) => {
        const symbol = activePlayer.symbol;

        // if cell isn't occupied add a symbol
        if (board.addSymbol(row, column, symbol)) {
            // direction composition, passes gameBoard instance into getGameState to check for a win, draw, or nothing
            const gameState = getGameState(board);

            // given no win or draw switch player turns
            if (gameState.status === GAME_STATE.IN_PROGRESS) {
                switchPlayerTurn();
            }
        }
    };

    return {
        restartGame,
        playRound,
        getBoard: board.getBoard, 
        getGameState: () => getGameState(board),
        getActivePlayer
    };
};

// factory function called at the end : hadles UI and click events 
function displayLogic() {
    // direct composition : define a boardControl instance as game
    const game = boardControl();

    // cache DOM
    const $boardDiv = document.querySelector('.board');
    const $gameOptionsDiv = document.querySelector('.game-options');

    // arrow function used to switch turn icon lights
    const switchIcons = () => {
        const activePlayer = game.getActivePlayer();

        const $queenTurn = document.querySelector('.queenTurn');
        const $kingTurn = document.querySelector('.kingTurn');

        if (activePlayer.symbol === 'X') {
            $queenTurn.style.filter = 'opacity(1)';
            $kingTurn.style.filter = 'opacity(.3)';
        } else {
            $kingTurn.style.filter = 'opacity(1)';
            $queenTurn.style.filter = 'opacity(.3)';
        }
    };
    
    const updateDisplay = (gameState) => {
        // clear the board
        $boardDiv.innerHTML = '';

        // checking for a winning line
        const winningLine = gameState.status === 'WIN' ? gameState.winningLine : [];
        const symbolBoard = game.getBoard().flat().map(cell => cell.checkCellSymbol());

        symbolBoard.forEach((cellSymbol, index) => {
            // checks if the symbol's current index is part of the winning line
            const isWinner = winningLine.includes(index);
            // displayChecker is informed
            displayChecker(cellSymbol, index, isWinner);
        });
        switchIcons();
    };

    function displayChecker(symbol, index, isWinner) {
        // if isWinner is true assign 'winning-cell' else ''
        const winnerClass = isWinner ? 'winning-cell' : '';
        let svgHTML = '';

        // create cell svg based on symbol
        switch (symbol) {
            case '[ ]':
                svgHTML = `<svg data-position='${index}' class="emptyCellSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>border-radius</title><path d="M3 16C3 18.8 5.2 21 8 21H10V19H8C6.3 19 5 17.7 5 16V14H3V16M21 8C21 5.2 18.8 3 16 3H14V5H16C17.7 5 19 6.3 19 8V10H21V8M16 21C18.8 21 21 18.8 21 16V14H19V16C19 17.7 17.7 19 16 19H14V21H16M8 3C5.2 3 3 5.2 3 8V10H5V8C5 6.3 6.3 5 8 5H10V3H8Z" /></svg>`;
                break;
                
            case 'X':
                svgHTML = `<svg data-position='${index}' class="queenCellSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chess-queen</title><path d="M18,3A2,2 0 0,1 20,5C20,5.81 19.5,6.5 18.83,6.82L17,13.15V18H7V13.15L5.17,6.82C4.5,6.5 4,5.81 4,5A2,2 0 0,1 6,3A2,2 0 0,1 8,5C8,5.5 7.82,5.95 7.5,6.3L10.3,9.35L10.83,5.62C10.33,5.26 10,4.67 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.67 13.67,5.26 13.17,5.62L13.7,9.35L16.47,6.29C16.18,5.94 16,5.5 16,5A2,2 0 0,1 18,3M5,20H19V22H5V20Z" /></svg>`;
                break;

            case 'O':
                svgHTML = `<svg data-position='${index}' class="kingCellSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chess-king</title><path d="M19,22H5V20H19V22M17,10C15.58,10 14.26,10.77 13.55,12H13V7H16V5H13V2H11V5H8V7H11V12H10.45C9.35,10.09 6.9,9.43 5,10.54C3.07,11.64 2.42,14.09 3.5,16C4.24,17.24 5.57,18 7,18H17A4,4 0 0,0 21,14A4,4 0 0,0 17,10Z" /></svg>`;
                break;
        }

        // append svg as a child of .cellContainer with(out) .winning-cell
        $boardDiv.innerHTML += `<div class="cellContainer ${winnerClass}">${svgHTML}</div>`;
    }

    function clickEventHandler(event) {

        // if a restart click is detected run the restartGame fuction, update the display, and readd the eventlistener in case it's not there
        if (event.target.closest('.restartButton')){
            game.restartGame();
            updateDisplay(game.getGameState());
            $boardDiv.addEventListener('click', clickEventHandler);
        }

        const validPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        // event object's position attribute retrieved as an integer
        const selectedCell = parseInt(event.target.dataset.position, 10);

        // checks for expected values else return out
        if (!validPositions.includes(selectedCell)) {
            return
        }

        // determine cell position on the grid with indices and modulus/division
        // return object with the values and make them accessible through a new `coords` variable
        function determineRowColumn(selectedCell) {
            const row = (Math.floor(selectedCell / 3));
            const column = (selectedCell % 3);
            return {row, column}
        }
        const coords = determineRowColumn(selectedCell);

        // move game logic along with the given clicked cell
        game.playRound(coords.row, coords.column);

        const gameState = game.getGameState();

        // render new cells
        updateDisplay(gameState);

        if (gameState.status === 'WIN') {
            $boardDiv.removeEventListener('click', clickEventHandler);
        } else if (gameState.status === 'DRAW') {
            $boardDiv.removeEventListener('click', clickEventHandler);
        }
    };

    // adds a listener onto a top level container 
    $boardDiv.addEventListener('click', clickEventHandler);
    $gameOptionsDiv.addEventListener('click', clickEventHandler);
    updateDisplay(game.getGameState());
}

displayLogic();
