var router       = require('express').Router(),
    path         = require('path'),
    playerWorker = require('./workers/playerWorker');

var moveCache = {};

router
    .post('/move', function(req, res){
    	var move;

    	if( req.body.gameBoard in moveCache ){
    		move = moveCache[req.body.gameBoard]};
    	} else {
    		move = playerWorker.getMove(req.body.gameBoard);
       	}

    	res.json({'action': 'move', 'index': move});
    });

module.exports = router;