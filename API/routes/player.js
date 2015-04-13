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

        if( move[1] ){
            res.json({'action': move[0], 'index': move[1]});
        } else {
            res.json({'action': move[0]});
        }
    });

module.exports = router;