import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  session: service(),
  store: service(),

  load() {
    if (!this.get('session.isAuthenticated')) return;

    return this.store.queryRecord('user', { me: true }).then(function(user) {
      this.set('user', user);
    }.bind(this));
  }

});
