import Ember from 'ember';

export default Ember.Controller.extend({

  // null = no game, 1 = user turn, 2 = cpu turn
  gameState: null
});
