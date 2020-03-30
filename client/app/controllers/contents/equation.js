import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  api_data: service(),
  // This field gets populated by the router setupController() call.
  equation_id: null,
  equation: null,

  loadEquation() {
    this.api_data.getRecord('equation', this.get('equation_id')).then(function(equation) {
      this.set('equation', equation);
    }.bind(this));
  }
});
