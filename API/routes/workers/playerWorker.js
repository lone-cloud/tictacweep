// DISCLAIMER: much of the core game logic here is based on https://www3.ntu.edu.sg/home/ehchua/programming/java/JavaGame_TicTacToe_AI.html

var startingDepth = 2,
    cpuPlayerSeed = 1,
    playerSeed = 0;

//figure out if the game is won or not
var gameIsWon = function (gameBoard) {
        if (isGameWon(playerSeed, gameBoard) || isGameWon(cpuPlayerSeed, gameBoard)) {
            return true;
        } else {
            return false;
        }
    },
    isGameWon = function (player, gameBoard) {
        if (horizontalVictory(player, gameBoard) || verticalVictory(player, gameBoard) || diagonalVictory(player, gameBoard)) {
            return true;
        }

        return false;
    },
    horizontalVictory = function (player, gameBoard) {
        if ((gameBoard[0][0] === player && gameBoard[1][0] === player && gameBoard[2][0] === player) ||
            (gameBoard[0][1] === player && gameBoard[1][1] === player && gameBoard[2][1] === player) ||
            (gameBoard[0][2] === player && gameBoard[1][2] === player && gameBoard[2][2] === player)) {
            return true;
        }

        return false;
    },
    verticalVictory = function (player, gameBoard) {
        if ((gameBoard[0][0] === player && gameBoard[0][1] === player && gameBoard[0][2] === player) ||
            (gameBoard[1][0] === player && gameBoard[1][1] === player && gameBoard[1][2] === player) ||
            (gameBoard[2][0] === player && gameBoard[2][1] === player && gameBoard[2][2] === player)) {
            return true;
        }

        return false;
    },
    diagonalVictory = function (player, gameBoard) {
        if ((gameBoard[0][0] === player && gameBoard[1][1] === player && gameBoard[2][2] === player) ||
            (gameBoard[0][2] === player && gameBoard[1][1] === player && gameBoard[2][0] === player)) {
            return true;
        }

        return false;
    };

//check if we have any moves left to make
var gotMovesLeft = function (gameBoard) {
        for (var i = 0; i < gameBoard.length; i++) {
            for (var j = 0; j < gameBoard[i].length; j++) {
                if (gameBoard[i][j] === -1) {
                    return true;
                }
            }
        }

        return false;
    },
    getAvailableMoves = function (gameBoard) {
        var rtnList = [];

        // don't get the available moves if the game is already over
        if (!gameIsWon(gameBoard)) {
            for (var i = 0; i < gameBoard.length; i++) {
                for (var j = 0; j < gameBoard[i].length; j++) {
                    if (gameBoard[i][j] === -1) {
                        rtnList.push([i, j]);
                    }
                }
            }
        }

        return rtnList;
    };

// get the optimal move using minimax
var minimax = function (depth, player, gameBoard) {
    var moves = getAvailableMoves(gameBoard), bestScore = (player === cpuPlayerSeed) ? (-1 * Number.MAX_VALUE) : Number.MAX_VALUE,
        currentScore, bestMove = [];

    // recursively call minimax unless we've reach max depth
    // we make an optimal move at depth == 2, then make the optimal move for the player at depth == 1,
    // then save our initial move index if the gameboard is in the best state for us in the very end
    if (moves.length === 0 || depth === 0) {
        bestScore = evaluate(gameBoard);
    } else {
        moves.forEach(function (move) {
            gameBoard[move[0]][move[1]] = player;
            if (player === 1) { // CPU
                currentScore = minimax(depth - 1, playerSeed, gameBoard)[0];

                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    bestMove = [move[0], move[1]];
                }
            } else { // the real player
                currentScore = minimax(depth - 1, cpuPlayerSeed, gameBoard)[0];

                if (currentScore < bestScore) {
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

// The core logic of the game. Calculate the game score based on the current game state by
// evaluating each possible winning line: all rows, all columns and both diagonals.
var evaluate = function (gameBoard) {
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
    },
    // For the maximizing ( CPU ) player:
    // score == 100 on game winning move ( 3 in a row ), score == 10 on great move ( 2 in a row and last field is free ),
    // score == 1 on okay move ( 1 on a line with all free fields ), score == 0 on crappy move
    evaluateLine = function (row1, col1, row2, col2, row3, col3, gameBoard) {
        var score = 0;

        // first cell
        if (gameBoard[row1][col1] === cpuPlayerSeed) {
            score = 1;
        } else if (gameBoard[row1][col1] === playerSeed) {
            score = -1;
        }

        // second cell
        if (gameBoard[row2][col2] === cpuPlayerSeed) {
            if (score == 1) {   // cell1 has cpuPlayerSeed
                score = 10;
            } else if (score == -1) {  // cell1 has playerSeed
                return 0;
            } else {  // cell1 is empty
                score = 1;
            }
        } else if (gameBoard[row2][col2] === playerSeed) {
            if (score == -1) { // cell1 has oppSeed
                score = -10;
            } else if (score == 1) { // cell1 has cpuPlayerSeed
                return 0;
            } else {  // cell1 is empty
                score = -1;
            }
        }

        // Third cell
        if (gameBoard[row3][col3] === cpuPlayerSeed) {
            if (score > 0) {  // cell1 and/or cell2 is mySeed
                score *= 10;
            } else if (score < 0) {  // cell1 and/or cell2 is oppSeed
                return 0;
            } else {  // cell1 and cell2 are empty
                score = 1;
            }
        } else if (gameBoard[row3][col3] === playerSeed) {
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
    getMove: function (gameBoard) {
        // first check if the
        if (gameIsWon(gameBoard)) {
            return ['victory', null];
        } else if (!gotMovesLeft(gameBoard)) {
            return ['tie', null];
        } else {
            var bestMove = minimax(startingDepth, cpuPlayerSeed, gameBoard)[1],
                action = 'move';

            gameBoard[bestMove[0]][bestMove[1]] = cpuPlayerSeed;

            if (gameIsWon(gameBoard)) {
                action = 'victory';
            }

            return [action, bestMove];
        }
    }
};