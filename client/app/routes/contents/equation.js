import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

// All of this setup is to asynchronously load the equation from the server.
// If we make promies calls in the router setup they are blocking, which
// prevents the html from rendering and screws with the unl template js.
export default Route.extend({
  equation_id: null,

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('equation_id', this.get('equation_id'));
  },

  model(route_params) {
    this.set('equation_id', route_params.id);
  }
});
