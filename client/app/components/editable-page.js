import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
// import renderMathInElement from 'katex';

export default Component.extend({
  api_data: service(),
  session: service(),
  currentUser: service(),
  page: null,
  content: '',
  name: null,
  isLoading: true,
  isEditing: false,

  safeContent: computed('page.content', function() {
    return htmlSafe(this.get('page').get('content'));
  }),

  renderMath() {
    let froalaViews = this.element.getElementsByClassName('fr-view');
    if (froalaViews.length == 0) return;

    renderMathInElement(froalaViews[0]);
  },

  didRender() {
    this.renderMath();
  },

  init() {
    this._super(...arguments);
    this.api_data.getAllRecords('page').then(function(pages) {
      for (let i = 0; i < pages.length; ++i) {
        let page = pages.objectAt(i);
        if (page.name != this.name) continue;

        this.set('page', page);
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
