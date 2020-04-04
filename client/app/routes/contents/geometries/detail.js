import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model(route_params) {
    return this.store.query('geometry', { number: route_params.number }).then(function(geometries) {
      return geometries.get('firstObject');
    });
  }
});
