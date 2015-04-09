var express      = require('express'),
    logger       = require('morgan'),
    compression  = require('compression'),
    path         = require('path'),
    bodyParser   = require('body-parser'),
    player       = require('./routes/player');

var app = express(),
    config = {
        webContentPath : path.join(__dirname, '..', 'Frontend', 'dist')
    };

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/player', player);

app.use(express.static(config.webContentPath));
//send the index.html by default as we're using an SPA
app.use(function(req, res){ res.sendFile(path.join(config.webContentPath, 'index.html')); });

module.exports = app;