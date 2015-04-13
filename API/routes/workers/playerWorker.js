var startingDepth = 2;

var whoWon = function(gameBoard){
        if(isGameWon(0, gameBoard)){
            return 1;
        } else if(isGameWon(1, gameBoard)){
            return -1;
        } else {
            return 0;
        }
    },
    isGameWon = function(player, gameBoard){
        if( horizontalVictory(player, gameBoard) || verticalVictory(player, gameBoard) || diagonalVictory(player, gameBoard) ){
            return true;
        }

        return false;
    },
    horizontalVictory = function(player, gameBoard){
        if((gameBoard[0][0] === player && gameBoard[1][0] === player && gameBoard[2][0] === player) ||
            (gameBoard[0][1] === player && gameBoard[1][1] === player && gameBoard[2][1] === player) ||
            (gameBoard[0][2] === player && gameBoard[1][2] === player && gameBoard[2][2] === player)){
            return true;
        }

        return false;
    },
    verticalVictory = function(player, gameBoard) {
        if((gameBoard[0][0] === player && gameBoard[0][1] === player && gameBoard[0][2] === player) ||
            (gameBoard[1][0] === player && gameBoard[1][1] === player && gameBoard[1][2] === player) ||
            (gameBoard[2][0] === player && gameBoard[2][1] === player && gameBoard[2][2] === player)){
            return true;
        }

        return false;
    },
    diagonalVictory = function(player, gameBoard) {
        if((gameBoard[0][0] === player && gameBoard[1][1] === player && gameBoard[2][2] === player) ||
            (gameBoard[0][2] === player && gameBoard[1][1] === player && gameBoard[2][0] === player)){
            return true;
        }

        return false;
    };

var gotMovesLeft = function(gameBoard){
    for(var i=0;i<gameBoard.length;i++){
        for(var j=0;j<gameBoard[i].length;j++){
            if(gameBoard[i][j] === -1){
                return true;
            }
        }
    }

    return false;
    },
    getAvailableMoves = function(gameBoard){
        var rtnList = [];

        if(whoWon(gameBoard) === 0 ){
            for(var i = 0;i < gameBoard.length; i++) {
                for (var j = 0; j < gameBoard[i].length; j++) {
                    if (gameBoard[i][j] === -1) {
                        rtnList.push([i, j]);
                    }
                }
            }
        }

        return rtnList;
    };

var minimax = function(depth, player, gameBoard){
    var moves = getAvailableMoves(gameBoard), bestScore = (player === 1) ? (-1 * Number.MAX_VALUE) : Number.MAX_VALUE,
        currentScore, bestMove =[];

    if(moves.length === 0 || depth === 0) {
        bestScore = evaluate(gameBoard);
    } else {
        moves.forEach(function(move){
            gameBoard[move[0]][move[1]] = player;
            if(player === 1){ // CPU
                currentScore = minimax(depth-1, 0, gameBoard)[0];

                if(currentScore > bestScore){
                    bestScore = currentScore;
                    bestMove = [move[0], move[1]];
                }
            } else { // the real player
                currentScore = minimax(depth-1, 1, gameBoard)[0];

                if(currentScore < bestScore){
                    bestScore = currentScore;
                    bestMove = [move[0], move[1]];
                }
            }
            // undo move
            gameBoard[move[0]][move[1]] = -1;
        });
    }

    return [bestScore, bestMove];
};

var evaluate = function(gameBoard){
    var score = 0;
    // Evaluate score for each of the 8 lines (3 rows, 3 columns, 2 diagonals)
    score += evaluateLine(0, 0, 0, 1, 0, 2, gameBoard);  // row 0
    score += evaluateLine(1, 0, 1, 1, 1, 2, gameBoard);  // row 1
    score += evaluateLine(2, 0, 2, 1, 2, 2, gameBoard);  // row 2
    score += evaluateLine(0, 0, 1, 0, 2, 0, gameBoard);  // col 0
    score += evaluateLine(0, 1, 1, 1, 2, 1, gameBoard);  // col 1
    score += evaluateLine(0, 2, 1, 2, 2, 2, gameBoard);  // col 2
    score += evaluateLine(0, 0, 1, 1, 2, 2, gameBoard);  // diagonal
    score += evaluateLine(0, 2, 1, 1, 2, 0, gameBoard);  // alternate diagonal

    return score;
    }, evaluateLine = function(row1, col1, row2, col2, row3, col3, gameBoard) {
    var score = 0;

    // First cell
    if (gameBoard[row1][col1] === 1) {
        score = 1;
    } else if (gameBoard[row1][col1] === 0) {
        score = -1;
    }

    // Second cell
    if (gameBoard[row2][col2] === 1) {
        if (score == 1) {   // cell1 is mySeed
            score = 10;
        } else if (score == -1) {  // cell1 is oppSeed
            return 0;
        } else {  // cell1 is empty
            score = 1;
        }
    } else if (gameBoard[row2][col2] === 0) {
        if (score == -1) { // cell1 is oppSeed
            score = -10;
        } else if (score == 1) { // cell1 is mySeed
            return 0;
        } else {  // cell1 is empty
            score = -1;
        }
    }

    // Third cell
    if (gameBoard[row3][col3] === 1) {
        if (score > 0) {  // cell1 and/or cell2 is mySeed
            score *= 10;
        } else if (score < 0) {  // cell1 and/or cell2 is oppSeed
            return 0;
        } else {  // cell1 and cell2 are empty
            score = 1;
        }
    } else if (gameBoard[row3][col3] === 0) {
        if (score < 0) {  // cell1 and/or cell2 is oppSeed
            score *= 10;
        } else if (score > 1) {  // cell1 and/or cell2 is mySeed
            return 0;
        } else {  // cell1 and cell2 are empty
            score = -1;
        }
    }
    return score;
};

module.exports = {
    // Get the move and its action as an array [action, [moveRow, moveColumn]]
    // action is one of tie/victory/move depending on the state of the game after the move
	getMove: function(gameBoard) {
        var player = 1;

        if(whoWon(gameBoard)){
            return ['victory', null];
        } else if(!gotMovesLeft(gameBoard)) {
            return ['tie', null];
        } else {
            var bestMove = minimax(startingDepth, player, gameBoard)[1],
                action = 'move';

            gameBoard[bestMove[0]][bestMove[1]] = player;

            if(whoWon(gameBoard)){
                action = 'victory';
            }

            return [action, bestMove];
        }
	}
};