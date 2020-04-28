import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import config from '../../config/environment';
import { handleFetchErrors } from 'client/utils/utils';

export default Controller.extend({
  router: service(),
  toast: service(),

  queryParams: ['email', 'token'],
  token: null,

  tokenIsValid: null,
  tokenWasVerified: false,

  message: null,
  password: '',
  retype: '',

  _verifyToken() {
    let headers = {
      Accept: 'application/vnd.api+json'
    };
    headers['Content-Type'] = 'application/vnd.api+json';
    let url = `${config.host}/password_reset/validate_token/`;

    return fetch(url, {
      headers: headers,
      method: 'post',
      body: JSON.stringify({
        data: {
          type: 'ResetPasswordValidateToken',
          attributes: {
            token: this.get('token')
          }
        }
      })
    }).then(handleFetchErrors);
  },

  _updatePassword() {
    let headers = {
      Accept: 'application/vnd.api+json'
    };
    headers['Content-Type'] = 'application/vnd.api+json';
    let url = `${config.host}/password_reset/confirm/`;

    return fetch(url, {
      headers: headers,
      method: 'post',
      body: JSON.stringify({
        data: {
          type: 'ResetPasswordConfirmation',
          attributes: {
            token: this.get('token'),
            password: this.get('password')
          }
        }
      })
    }).then(handleFetchErrors);
  },

  init() {
    this._super(...arguments);
    // Can't access query params in init for some reason, need to wait til next
    // render.
    next(this, function() {
      this._verifyToken().then(function() {
        this.set('tokenWasVerified', true);
        this.set('tokenIsValid', true);
      }.bind(this), function() {
        this.set('tokenIsValid', false);
        this.set('tokenWasVerified', true);
      }.bind(this));
    });
  },

  actions: {
    submit() {
      if (this.get('password') != this.get('retype')) {
        this.set('message', 'Passwords do not match.');
        return;
      }

      this._updatePassword().then(function() {
        this.toast.success('Password updated successfully! Redirecting you to login.');
        later(this, function() {
          this.get('router').transitionTo('admin.account')
        }, 3000);
      }.bind(this), function(reason) {
        this.toast.warning(`Error updating password: ${formatErrors(reason.errors)}`);
      });
    }
  }

});
