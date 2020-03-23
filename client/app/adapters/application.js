import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  session: service('session'),
  host: computed(function() {
    return config.host;
  }),

  headers: computed('session.data.authenticated.token', function() {
    let headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Token ${this.session.data.authenticated.token}`;
    }
    return headers;
  })
});
