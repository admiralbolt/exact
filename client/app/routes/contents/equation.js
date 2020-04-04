import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service(),

  model(route_params) {
    return this.api_data.getRecord('equation', route_params.id);
  }
});
