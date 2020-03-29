import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  api_data: service(),
  // This field gets populated by the router setupController() call.
  equation_id: null,

  equation: computed('equation_id', function() {
    this.api_data.getRecord('equation', this.get('equation_id')).then(function(equation) {
      this.set('equation', equation);
    }.bind(this));
  })
});
