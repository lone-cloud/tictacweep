import Ember from 'ember';

export default Ember.Controller.extend({

  // null = no game, 0 = user turn, 1 = cpu turn
  gameState: null,

  // string representation of the board
  // -1 = empty, 0 = player's mark, 1 = computer's mark
  gameBoard: [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]],

  onGameStateChange: function(){
    if(this.get('isGameStateCPUTurn')){
      Ember.$.post('/api/player/move', {'gameBoard': JSON.stringify(this.get('gameBoard'))}, function(data){
          alert('Got:' + data);
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
    },

    playerMove: function(x, y){
      var gameBoard = this.get('gameBoard');
      gameBoard[x][y] = 0;
      this.get('gameBoard', gameBoard);

      this.set('gameState', 1);
    }
  }
});
