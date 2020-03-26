import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  // The equation to display
  equation: null,

  contentUrl: computed('equation.content_file', function() {
    return htmlSafe(`${this.get('equation.content_file')}&embedded=true`);
  })
});
