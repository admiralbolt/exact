import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  api_data: service(),
  is_loading: true,
  equations: null,

  init() {
    this._super(...arguments);
    this.api_data.getAllRecords('equation').then(function(equations) {
      this.set('equations', equations);
    }.bind(this));
  }

});
