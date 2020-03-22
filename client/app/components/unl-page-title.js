import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

// A component that dynamically generates breadcrumbs and title based on the
// currently defined route.
export default Component.extend({
  router: service(),

  // Converts from kebab case to title case.
  titleize(name) {
    let words = name.split('-');
    let capitalWords = words.map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);
    return capitalWords.join(' ');
  },

  getRouteParts() {
    let routeName = this.get('router.currentRouteName');
    // Sub routes have periods in them.
    let routeParts = routeName.split('.');
    if (routeParts[routeParts.length - 1] == 'index') routeParts.pop();

    return routeParts;
  },

  // An array of elements that have links for sub navigation.
  links: computed('router.currentRouteName', function() {
    let routeParts = this.getRouteParts();
    let links = []
    for (let i = 0; i < routeParts.length - 1; ++i) {
      let part = routeParts[i];
      if (part == 'home') continue;

      links.push({route: part, text: this.titleize(part)});
    }
    return links;
  }),

  pageTitle: computed('router.currentRouteName', function() {
    let routeParts = this.getRouteParts();
    return this.titleize(routeParts[routeParts.length -1]);
  })

});
