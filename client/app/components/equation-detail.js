import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { isNone } from '@ember/utils';

export default Component.extend({
  // The equation to display
  equation: null,
  session: service(),

  contentUrl: computed('equation.content_file', function() {
    return htmlSafe(`${this.get('equation.content_file')}`);
  }),

  showSource: computed('equation.source_file', function() {
    return this.get('session.isAuthenticated') && !isNone(this.get('equation.source_file'));
  }),

  sourceFileName: computed('equation.source_file', function() {
    return isNone(this.get('equation.source_file')) ? 'No file selected' : this.get('equation.source_file').split(/(\\|\/)/g).pop();
  }),
});
