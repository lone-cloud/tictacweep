var router = require('express').Router(),
    path   = require('path');

router
    .post('/move', function(req, res){
        res.json({"gameBoard": req.body.gameBoard});
    });

module.exports = router;