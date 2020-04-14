import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty, isNone } from '@ember/utils';
import { formatErrors, validateEmail } from 'client/utils/utils';
import config from '../../config/environment';

let USER_PROPS = ['username', 'email', 'first_name', 'last_name'];

export default Controller.extend({
  currentUser: service(),
  session: service(),
  toast: service(),
  errors: null,

  accountInfo: null,
  validationErrors: null,

  newPassword: '',
  newPasswordRetype: '',
  passwordError: '',

  initializeAccountInfo() {
    let user = this.get('currentUser.user');
    let info = {};
    USER_PROPS.forEach(function(prop) {
      info[prop] = isNone(user) ? '' : user.get(prop);
    }.bind(this));

    this.password = '';
    this.passwordRetype = '';

    this.set('accountInfo', info);
  },

  validate() {
    let validationErrors = {};
    let accountInfo = this.get('accountInfo');
    if (isEmpty(accountInfo.username) || isNone(accountInfo.username)) {
      validationErrors['username'] = 'Username is required.';
    }

    if (isEmpty(accountInfo.email) || isNone(accountInfo.email)) {
      validationErrors['email'] = 'Email is required.';
    } else if (!validateEmail(accountInfo.email)) {
      validationErrors['email'] = 'Please enter a valid email address.';
    }

    this.set('validationErrors', validationErrors);
    return Object.keys(validationErrors).length == 0;
  },

  actions: {
    authenticate() {
      let credentials = this.getProperties('username', 'password');
      let authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).then(() => {
        this.get('currentUser').load().then(function() {
          this.initializeAccountInfo();
        }.bind(this));
      }, (reason) => {
        this.set('errors', reason.json.non_field_errors);
      });
    },

    invalidateSession() {
      this.get('session').invalidate();
    },

    save() {
      if (!this.validate()) return;

      let user = this.get('currentUser.user');
      USER_PROPS.forEach(function(prop) {
        user.set(prop, this.accountInfo[prop]);
      }.bind(this));

      user.save().then(function() {
        this.get('currentUser').load();
        this.toast.success('Account updated successfully!');
      }.bind(this), function(reason) {
        this.toast.warning(`Error saving account information: ${formatErrors(reason.errors)}`);
        user.rollbackAttributes();
      }.bind(this));
    },

    newPassword() {
      if (isEmpty(this.get('newPassword'))) {
        this.set('newPasswordError', 'No password entered.');
        return;
      }

      if (this.get('newPassword') != this.get('newPasswordRetype')) {
        this.set('newPasswordError', 'Passwords do not match.');
        return;
      }

      this.set('passwordError', '');
      let headers = {
        Accept: 'application/vnd.api+json'
      };
      if (this.session.isAuthenticated) {
        // Apparently authorization has to be lower case, wtf?
        headers.authorization = `Token ${this.session.data.authenticated.token}`;
      }
      headers['Content-Type'] = 'application/vnd.api+json';
      fetch(`${config.host}/new_password/?password=${this.get('newPassword')}`, {
        headers: headers,
        method: 'post',
      }).then(function() {
        this.toast.success('Password updated successfully!');
        this.set('newPassword', '');
        this.set('newPasswordRetype', '');
      }.bind(this));


    }

  }
});
