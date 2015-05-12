# Tic Tac Weep

## Purpose:
Create a tic-tac-toe app where the user plays against the CPU and never wins. :'(

## Demo

https://tictacweep.herokuapp.com/

## Tech stack:
Backend: Express.js for web/app server
Frontend: Ember-cli (ember + jquery + handlebars + brocolli) + jquery-ui's effect-highlight.js for the highlight effect

## Juicy source files:
API: app.js, routes/player.js, routes/workers/playerWorker.js
Frontend: app/controllers/index.js, app/styles/app.css, app/templates/index.js, app/views/index.js

## Implementation:
I've implemented this game using an SPA app via Ember-cli on the frontend and an Express.js backend. Whenever a player makes a move by clicking on the tic-tac-toe board, we send the entire board state to the backend ( /api/player/turn ) and return the optimal move. The response is cached in a JS object where the initial gameboard state is the key. Much of the core game logic is based on a minimax algorithm from https://www3.ntu.edu.sg/home/ehchua/programming/java/JavaGame_TicTacToe_AI.html.

## Deployment notes
Some typically unneccesary files had to be committed to please the heroku overloards and to get this deploying easily as an NPM project. /package.json and /Procfile as well as the entire /Frontend/dist directory are there just for the lols.