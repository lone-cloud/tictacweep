import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    var self = this;

    Ember.$('.empty')
      .mouseenter(function(){
        var $ = Ember.$;

        if(self.get('controller.isGameStatePlayersTurn') && !$(this).find('.o-entered').length ){
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

          elem.removeClass('empty');
          elem.find('.o-preview').delay(100).remove();
          elem.delay(100).append("<span class='o-entered'>O</span>");
          self.get('controller').send('playerMove', elem.parent().index(), elem.index());
        }
      });
  }
});
