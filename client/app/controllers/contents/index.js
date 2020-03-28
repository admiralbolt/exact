import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty, isNone } from '@ember/utils';
import { filter } from '@ember/object/computed';

export default Controller.extend({
  // Url params.
  queryParams: ['coord', 'category'],
  coord: null,
  category: null,

  api_data: service(),
  isLoading: true,
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

    return !isNone(coord) && !isNone(category)
      && coord.toLowerCase() == this.coord
      && category.toLowerCase() == this.category;
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

      // If this is an inital load nothing is selected yet, default to the first.
      if (isEmpty(this.get('coord'))) {
        this.set('coord', systems[0]);
        this.set('category', categories[this.get('coord')][0]);
      } else {
        this.set('coord', this.get('coord'));
        if (isEmpty(this.get('category')) || !categories[this.get('coord')].includes(this.get('category'))) {
          this.set('category', categories[this.get('coord')][0]);
        } else {
          this.set('category', this.get('category'));
        }
      }
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
