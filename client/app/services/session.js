import SessionService from 'ember-simple-auth/services/session';
import { inject as service } from '@ember/service';

export default SessionService.extend({
  store: service()
});
