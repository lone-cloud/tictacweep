var router = require('express').Router(),
    path   = require('path');

router
    .post('/move', function(req, res){
        res.json({'action': 'move', index: [0, 1]});
    });

module.exports = router;