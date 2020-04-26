import Controller from '@ember/controller';
import { validateEmail } from 'client/utils/utils';
import config from '../../config/environment';

export default Controller.extend({
  email: '',
  message: '',

  actions: {
    submit() {
      let email = this.get('email');
      if (!validateEmail(email)) {
        this.set('message', 'Please enter a valid email.');
        return;
      }

      let headers = {
        Accept: 'application/vnd.api+json'
      };
      headers['Content-Type'] = 'application/vnd.api+json';
      let url = `${config.host}/password_reset/`;

      fetch(url, {
        headers: headers,
        method: 'post',
        body: JSON.stringify({
          data: {
            type: 'ResetPasswordRequestToken',
            attributes: {
              email: email
            }
          }
        })
      }).then(function() {
        this.set('message', 'A reset email has been sent.');
      }.bind(this));
    }
  }
});
