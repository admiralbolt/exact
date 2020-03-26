import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  api_data: service(),
  session: service(),
  page: null,
  content: '',
  name: null,
  isLoading: true,
  isEditing: false,

  init() {
    this._super(...arguments);
    console.log(this.api_data.getAllRecords('page'));
    this.api_data.getAllRecords('page').then(function(pages) {
      for (let i = 0; i < pages.length; ++i) {
        let page = pages.objectAt(i);
        if (page.name != this.name) continue;

        this.set('page', page);
        this.set('content', htmlSafe(this.get('page').get('content')));
        this.set('isLoading', false);
        return;
      }
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
