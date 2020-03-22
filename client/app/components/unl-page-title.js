import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  router: service(),

  pageTitle: computed('router.currentRouteName', function() {
    let routeName = this.get('router.currentRouteName');
    if (routeName == 'index') return 'Home';

    return `${routeName.charAt(0).toUpperCase()}${routeName.slice(1)}`;
  }),

});
