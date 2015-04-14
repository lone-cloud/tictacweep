import Ember from 'ember';

export default Ember.Controller.extend({

  // null = no game, 0 = user turn, 1 = cpu turn
  gameState: null,

  // type of an end to the game ( from CPU's perspective ): 'victory' or 'tie'
  endType: null,

  gamesWithoutLoss: 0,

  // string representation of the board
  // -1 = empty, 0 = player's mark, 1 = computer's mark
  gameBoard: [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1]
  ],

  lastBoardElementChangedIndex: null,

  onGameStateChange: function(){
    if(this.get('isGameStateCPUTurn')){
      var self = this;
      Ember.$.post('/api/player/turn', {'gameBoard': JSON.stringify(this.get('gameBoard'))}, function(data){
          if(data.action === 'move'){
            self.send('cpuMove', data.index[0], data.index[1]);
          } else if(data.action === 'victory'){
            self.send('cpuMove', data.index[0], data.index[1]);
            self.send('endGame', data.action);
          } else if(data.action === 'tie'){
            self.send('endGame', data.action);
          }
        }
      );
    }
  }.observes('gameState'),

  // dynamic properties to be used in the template
  cpuWonGame: function(){
    return this.get('endType') === 'victory';
  }.property('endType'),

  isGameStatePending: function(){
    return this.get('gameState') === null;
  }.property('gameState'),

  isGameStatePlayersTurn: function(){
    return this.get('gameState') === 0;
  }.property('gameState'),

  isGameStateCPUTurn: function(){
    return this.get('gameState') === 1;
  }.property('gameState'),

  // application state is to be changed via actions defined here
  actions: {
    newGame: function(){
      this.setProperties({
        gameState: 0,
        gameBoard: [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]],
        lastBoardElementChangedIndex: null
      });

      if(!this.get('gamesWithoutLoss') && localStorage && localStorage.getItem('ticTacWeep.gamesWithoutLoss')){
        this.set('gamesWithoutLoss', localStorage.getItem('ticTacWeep.gamesWithoutLoss'));
      }
    },

    playerMove: function(x, y){
      var gameBoard = this.get('gameBoard').slice();
      gameBoard[x][y] = 0;
      this.setProperties({
        lastBoardElementChangedIndex: [x, y],
        gameBoard: gameBoard,
        gameState: 1
      });
    },

    cpuMove: function(x, y){
      var gameBoard = this.get('gameBoard').slice();
      gameBoard[x][y] = 1;
      this.setProperties({
        lastBoardElementChangedIndex: [x, y],
        gameBoard: gameBoard,
        gameState: 0
      });
    },

    endGame: function(endType){
      this.set('gameState', null);
      this.set('endType', endType);

      var gamesWithoutLoss = this.get('gamesWithoutLoss');
      // make sure the browser supports localStorage
      gamesWithoutLoss++;
      if(localStorage){
        localStorage.setItem('ticTacWeep.gamesWithoutLoss', gamesWithoutLoss);
      }
      this.set('gamesWithoutLoss', gamesWithoutLoss);
    }
  }
});
