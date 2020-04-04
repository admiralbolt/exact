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
  doneLoading: false,
  equations: null,

  // Two levels of navigation, coordinate system and category.
  coordinateSystems: null,
  // A dictionary mapping coordinate system -> a list of categories.
  categories: null,
  activeCategories: computed('categories', 'coord', function() {
    if (this.get('categories') == null) return [];

    return this.get('categories')[this.get('coord')];
  }),
  // The equations that match the coord and category.
  activeEquations: filter('equations', ['coord', 'category'], function(equation) {
    let coord = equation.get('equation_type.coordinate_system');
    let category = equation.get('equation_type.category');

    return !isNone(coord) && !isNone(category) && !isNone(this.coord) && !isNone(this.category)
      && coord.toLowerCase() == this.coord.toLowerCase()
      && category.toLowerCase() == this.category.toLowerCase();
  }),

  init() {
    this._super(...arguments);
    this.set('equations', []);
    this.api_data.getAllRecords('equation').then(function(equations) {
      this.set('equations', equations);
      this.loadMenuData();
    }.bind(this));
  },

  // Loads all the menu items necessary for
  loadMenuData() {
    this.api_data.getAllRecords('equation_type').then(function(equation_types) {
      let systems = [];
      let categories = {};
      equation_types.forEach((eq_type) => {
        if (!systems.includes(eq_type.coordinate_system)) {
          systems.push(eq_type.coordinate_system);
          categories[eq_type.coordinate_system] = [];
        }

        categories[eq_type.coordinate_system].push(eq_type.category.toLowerCase());
      });

      // Sort our menu items.
      systems.sort();
      Object.keys(categories).forEach(function(key) {
        categories[key].sort();
      });
      this.set('coordinateSystems', systems);
      this.set('categories', categories);
      this.set('doneLoading', true);
    }.bind(this));
  },

  actions: {
    setSelectedCoord(name) {
      if (this.get('coord') == name) return;

      this.set('coord', name);
      this.set('category', this.get('categories')[name][0]);
    },

    setSelectedCategory(name) {
      if (this.get('category') == name) return;

      this.set('category', name);
    }
  }

});
