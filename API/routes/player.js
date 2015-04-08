var router = require('express').Router(),
    path   = require('path');

router
    .get('/move', function(req, res){
        res.json({"test": "123"});
    });

module.exports = router;