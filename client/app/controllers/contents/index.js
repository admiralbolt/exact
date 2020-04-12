import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';
import { filter } from '@ember/object/computed';

export default Controller.extend({
  // Url params.
  queryParams: ['coord', 'category'],
  coord: 'Cartesian',
  category: '1d infinite body',

  api_data: service(),
  session: service(),
  doneLoading: false,
  equations: null,

  creatingNew: false,

  // Two levels of navigation, coordinate system and category.
  coordinateSystems: computed('model.equation_types', function() {
    let systems = [];
    let equation_types = this.get('model.equation_types');
    equation_types.forEach((eq_type) => {
      if (systems.includes(eq_type.coordinate_system)) return;

      systems.push(eq_type.coordinate_system);
    });
    systems.sort();
    return systems;
  }),

  // A dictionary mapping coordinate system -> a list of categories.
  categories: computed('model.equation_types', function() {
    let categories = {};
    let equation_types = this.get('model.equation_types');
    equation_types.forEach((eq_type) => {
      if (!(categories.hasOwnProperty(eq_type.coordinate_system))) {
        categories[eq_type.coordinate_system] = [];
      }

      categories[eq_type.coordinate_system].push(eq_type.category.toLowerCase());
    });
    Object.keys(categories).forEach(function(key) {
      categories[key].sort();
    });
    return categories;
  }),

  activeCategories: computed('categories', 'coord', function() {
    if (this.get('categories') == null) return [];

    return this.get('categories')[this.get('coord')];
  }),
  // The equations that match the coord and category.
  activeEquations: filter('model.equations', ['coord', 'category'], function(equation) {
    let coord = equation.get('equation_type.coordinate_system');
    let category = equation.get('equation_type.category');

    return !isNone(coord) && !isNone(category) && !isNone(this.coord) && !isNone(this.category)
      && coord.toLowerCase() == this.coord.toLowerCase()
      && category.toLowerCase() == this.category.toLowerCase();
  }),

  actions: {
    setSelectedCoord(name) {
      if (this.get('coord') == name) return;

      this.set('coord', name);
      this.set('category', this.get('categories')[name][0]);
    },

    setSelectedCategory(name) {
      if (this.get('category') == name) return;

      this.set('category', name);
    },

    createNew() {
      this.set('creatingNew', true);
    },

    createCallback() {
      this.set('creatingNew', false);
    }
  }

});
