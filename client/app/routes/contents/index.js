import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  api_data: service(),

  queryParams : {
    coord: {
      replace: true
    },
    category: {
      replace: true
    }
  },

  model() {
    return hash({
      equation_types: this.api_data.getAllRecords('equation_type'),
      equations: this.api_data.getAllRecords('equation')
    });
  }
});
