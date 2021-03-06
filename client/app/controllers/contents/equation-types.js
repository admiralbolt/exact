import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  creatingNew: false,

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _sortProperties: ['coordinate_system', 'category'],
  equationTypes: sort('model', '_sortProperties'),

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
