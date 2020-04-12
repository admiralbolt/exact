import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';

let USER_PROPS = ['username', 'email', 'first_name', 'last_name'];

export default Controller.extend({
  currentUser: service(),
  session: service(),
  errors: null,

  accountInfo: null,

  initializeAccountInfo() {
    let user = this.get('currentUser.user');
    let info = {};
    USER_PROPS.forEach(function(prop) {
      info[prop] = isNone(user) ? '' : user.get(prop);
    }.bind(this));
    info.password = '';
    info.passwordRetype = '';

    this.set('accountInfo', info);
  },

  validate() {
      return true;
  }

  actions: {
    authenticate() {
      let credentials = this.getProperties('username', 'password');
      let authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).then(() => {
        this.initializeAccountInfo();
      }, (reason) => {
        this.set('errors', reason.json.non_field_errors);
      });
    },

    invalidateSession() {
      this.get('session').invalidate();
    },

    save() {
      if (!validate()) return;
    }

  }
});
