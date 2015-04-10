var score = function(gameBoard){
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
};

module.exports = {
	getMove: function(gameBoard) {
        if(score(gameBoard)){
            return 'victory';
        } else if(!gotMovesLeft(gameBoard)) {
            return 'tie';
        } else {
            return [0,1];
        }
	}
};