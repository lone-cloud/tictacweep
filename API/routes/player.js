var router       = require('express').Router(),
    path         = require('path'),
    playerWorker = require('./workers/playerWorker');

var moveCache = {};

router
    .post('/turn', function(req, res){
    	var move;

    	if( req.body.gameBoard in moveCache ){
    		move = moveCache[req.body.gameBoard];
    	} else {
    		move = playerWorker.getMove(JSON.parse(req.body.gameBoard));
            moveCache[req.body.gameBoard] = move;
       	}

        if(move === 'victory'){
            res.json({'action': 'declareVictory'});
        } else if(move === 'tie') {
            res.json({'action': 'declareTie'});
        } else {
            res.json({'action': 'move', 'index': move});
        }
    });

module.exports = router;