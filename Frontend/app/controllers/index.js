import Ember from 'ember';

export default Ember.Controller.extend({

  // null = no game, 0 = user turn, 1 = cpu turn
  gameState: null,

  // string representation of the board
  // -1 = empty, 0 = player's mark, 1 = computer's mark
  gameBoard: [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]],

  lastBoardElementChangedIndex: null,

  onGameStateChange: function(){
    if(this.get('isGameStateCPUTurn')){
      var self = this;
      Ember.$.post('/api/player/turn', {'gameBoard': JSON.stringify(this.get('gameBoard'))}, function(data){
          if(data.action === 'move'){
            self.send('cpuMove', data.index[0], data.index[1]);
          } else if(data.action === 'declareVictory'){
            alert('CPU DECLARED VICTORY');
          } else if(data.action === 'declareTie'){
            alert('CPU DECLARED TIE')
          }
        }
      );
    }
  }.observes('gameState'),

  isGameStatePending: function(){
    return this.get('gameState') === null;
  }.property('gameState'),

  isGameStatePlayersTurn: function(){
    return this.get('gameState') === 0;
  }.property('gameState'),

  isGameStateCPUTurn: function(){
    return this.get('gameState') === 1;
  }.property('gameState'),

  actions: {
    newGame: function(){
      this.set('gameState', 0);
      this.set('gameBoard', [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]);
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
        'gameBoard': gameBoard,
        'gameState': 0
      });
    }
  }
});
