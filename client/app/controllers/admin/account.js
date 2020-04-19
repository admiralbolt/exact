import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty, isNone } from '@ember/utils';
import { formatErrors, validateEmail } from 'client/utils/utils';
import config from '../../config/environment';

let USER_PROPS = ['username', 'email', 'first_name', 'last_name'];

export default Controller.extend({
  api_data: service(),
  currentUser: service(),
  session: service(),
  toast: service(),
  errors: null,

  accountInfo: null,
  validationErrors: null,

  newUserInfo: null,
  newUserValidationErrors: null,

  newPassword: '',
  newPasswordRetype: '',
  passwordError: '',

  selectedTab: 'accountInfo',

  init() {
    this._super(...arguments);
    this.set('newUserInfo', {});
  },

  initializeAccountInfo() {
    let user = this.get('currentUser.user');
    let info = {};
    USER_PROPS.forEach(function(prop) {
      info[prop] = isNone(user) ? '' : user.get(prop);
    }.bind(this));

    this.set('newPassword', '');
    this.set('newPasswordRetype', '');
    this.set('accountInfo', info);
  },

  validate(infoKey, errorKey) {
    let validationErrors = {};
    let accountInfo = this.get(infoKey);
    if (isEmpty(accountInfo.username) || isNone(accountInfo.username)) {
      validationErrors['username'] = 'Username is required.';
    }

    if (isEmpty(accountInfo.email) || isNone(accountInfo.email)) {
      validationErrors['email'] = 'Email is required.';
    } else if (!validateEmail(accountInfo.email)) {
      validationErrors['email'] = 'Please enter a valid email address.';
    }

    this.set(errorKey, validationErrors);
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
      if (!this.validate('accountInfo', 'validationErrors')) return;

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
    },

    setSelectedTab(tab) {
      this.set('selectedTab', tab);
    },

    createNewUser() {
      if (!this.validate('newUserInfo', 'newUserValidationErrors')) return;

      let newUserInfo = this.get('newUserInfo');
      let user = this.get('api_data.store').createRecord('user', {
        username: newUserInfo.username,
        password: newUserInfo.password,
        email: newUserInfo.email,
      });
      if (!isEmpty(newUserInfo.first_name)) {
        user.set('first_name', newUserInfo.first_name);
      }

      if (!isEmpty(newUserInfo.last_name)) {
        user.set('last_name', newUserInfo.last_name);
      }

      console.log(user);

      user.save().then(function() {
        this.toast.success('User created successfully!');
        this.set('newUserInfo', {});
      }.bind(this), function(reason) {
        this.toast.error(`Error creating user: ${formatErrors(reason)}`);
      }.bind(this));
    }

  }
});
