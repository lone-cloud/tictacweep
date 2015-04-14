import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    var self = this, $ = Ember.$;

    // jquery event handlers
    $(document.body)
      .on('mouseenter', '.empty', function(){
      if(self.get('controller.isGameStatePlayersTurn') && !$(this).find('.mark-entered').length ){
        $(this).delay(100).append("<span class='o-preview'>X</span>");
      }
    })
      .on('mouseleave', '.empty', function(){
        $(this).find('.o-preview').delay(100).remove();
    })
      .on('click', '.empty', function(){
        if(self.get('controller.isGameStatePlayersTurn') && $(this).find('.o-preview').length){
          var elem = $(this);
          self.get('controller').send('playerMove', elem.index(), elem.parent().index());
        }
    });
  },

  // update the visual board whenever the underlying gameBoard data changes
  onGameBoardChange: function(){
    var $ = Ember.$, gameBoard = this.get('controller.gameBoard'), lastBoardElementChangedIndex = this.get('controller.lastBoardElementChangedIndex');

    if(lastBoardElementChangedIndex){
      var x = lastBoardElementChangedIndex[0], y = lastBoardElementChangedIndex[1];
      var elem = $('#game-table').find('tr').eq(y).find('td').eq(x);

      if(gameBoard[x][y] === 0){
        elem.removeClass('empty');
        elem.find('.o-preview').delay(100).remove();
        elem.delay(100).append("<span class='mark-entered'>X</span>");
      } else if(gameBoard[x][y] === 1){
        elem.removeClass('empty');
        elem.find('.o-preview').delay(100).remove();
        elem.delay(100).append("<span class='mark-entered red'>O</span>");
        this.get('flashElement')(elem.find('.mark-entered.red'));
      }
    } else { // lastBoardElementChangedIndex = null means we're starting a new game
      $('.square').empty().addClass('empty');
    }
  }.observes('controller.gameBoard.[]'),

  // use jquery-ui effects to highlight/flash the element for attention
  flashElement: function(elem){
    elem.delay(100).effect('highlight', {color: '#F991A4'});
  },

  onGameStateChange: function(){
    if(this.get('controller.isGameStatePlayersTurn')){
      this.get('flashElement')(Ember.$('#info-panel'));
    }
  }.observes('controller.gameState')
});
