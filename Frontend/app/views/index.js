import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    var self = this;

    Ember.$('.empty')
      .mouseenter(function(){
        var $ = Ember.$;

        if(self.get('controller.isGameStatePlayersTurn') && !$(this).find('.mark-entered').length ){
          $(this).delay(100).append("<span class='o-preview'>O</span>");
        }
      })
      .mouseleave(function(){
        Ember.$(this).find('.o-preview').delay(100).remove();
      })
      .click(function(){
        var $ = Ember.$;

        if(self.get('controller.isGameStatePlayersTurn') && $(this).find('.o-preview').length){
          var elem = $(this);
          self.get('controller').send('playerMove', elem.parent().index(), elem.index());
        }
      });
  },

  // update the visual board whenever the underlying gameBoard data changes
  onGameBoardChange: function(){
    var $ = Ember.$, gameBoard = this.get('controller.gameBoard'), lastBoardElementChangedIndex = this.get('controller.lastBoardElementChangedIndex');

    if(lastBoardElementChangedIndex){
      var x = lastBoardElementChangedIndex[0], y = lastBoardElementChangedIndex[1];
      var elem = $('#game-table').find('tr').eq(x).find('td').eq(y);

      if(gameBoard[x][y] === 0){
        elem.removeClass('empty');
        elem.find('.o-preview').delay(100).remove();
        elem.delay(100).append("<span class='mark-entered'>O</span>");
      } else if(gameBoard[x][y] === 1){
        elem.removeClass('empty');
        elem.find('.o-preview').delay(100).remove();
        elem.delay(100).append("<span class='mark-entered red'>X</span>");
        elem.find('.mark-entered.red').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
      }
    }
  }.observes('controller.gameBoard.[]')
});
