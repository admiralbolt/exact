import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service(),

  model() {
    return this.api_data.getAllRecords('equation-type');
  }
});
