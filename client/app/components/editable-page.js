import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  store: service(),
  session: service(),
  page: null,
  content: '',
  name: null,
  isLoading: true,
  isEditing: false,

  init() {
    this._super(...arguments);
    this.get('store').query('page', {
      filter: {
        name: this.name
      }
    }).then(function(pages) {
      this.set('page', pages.get('firstObject'));
      this.set('content', htmlSafe(this.get('page').get('content')));
      this.set('isLoading', false);
    }.bind(this));
  },

  actions: {
    toggleEditing() {
      this.toggleProperty('isEditing');
    },
    save() {
      this.get('page').set('content', this.get('content'));
      this.get('page').save();
      this.toggleProperty('isEditing');
    }
  }

});
