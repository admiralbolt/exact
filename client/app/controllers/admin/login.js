import Controller from '@ember/controller';
import { inject as service } from '@ember/service';


export default Controller.extend({
  session: service(),
  errors: null,

  actions: {
    authenticate() {
      let credentials = this.getProperties('username', 'password');
      let authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).then(() => {
      }, (reason) => {
        this.set('errors', reason.json.non_field_errors);
      });
    },

    invalidateSession() {
      this.get('session').invalidate();
    }

  }
});
