import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  api_data: service(),

  model() {
    return hash({
      equations: this.api_data.getAllRecords('equation')
    });
  }
});
