import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  creatingNew: false,

  createCallback() {
    this.set('creatingNew', false);
  },

  actions: {
    createCallback() {
      this.set('creatingNew', false);
    },

    new() {
      this.set('creatingNew', true);
    }
  }
});
