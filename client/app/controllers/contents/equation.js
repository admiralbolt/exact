import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  api_data: service(),
  // This field gets populated by the router setupController() call.
  equation_id: null,
  equation: computed('equation_id', function() {
    if (this.get('equation_id') == null) return null;

    return this.api_data.getRecord('equation', this.get('equation_id'));
  })
});
