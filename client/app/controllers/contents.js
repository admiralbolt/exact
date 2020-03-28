import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { filter } from '@ember/object/computed';

export default Controller.extend({
  api_data: service(),
  isLoading: true,
  equations: null,

  // Two levels of navigation, coordinate system and category.
  coordinateSystems: null,
  selectedCoord: '',
  // A dictionary mapping coordinate system -> a list of categories.
  categories: null,
  activeCategories: computed('categories', 'selectedCoord', function() {
    if (this.get('categories') == null) return [];

    return this.get('categories')[this.get('selectedCoord')];
  }),
  selectedCategory: '',
  // The equations that match the selectedCoord and category.
  activeEquations: filter('equations', ['selectedCoord', 'selectedCategory'], function(equation) {
    return equation.get('equation_type.coordinate_system') == this.selectedCoord
      && equation.get('equation_type.category') == this.selectedCategory;
  }),

  init() {
    this._super(...arguments);
    this.api_data.getAllRecords('equation').then(function(equations) {
      this.set('equations', equations);
    }.bind(this));

    this.loadMenuData();
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

        categories[eq_type.coordinate_system].push(eq_type.category);
      });

      // Sort our menu items.
      systems.sort();
      Object.keys(categories).forEach(function(key) {
        categories[key].sort();
      });
      this.set('coordinateSystems', systems);
      this.set('categories', categories);

      // If this is an inital load nothing is selected yet, default to the first.
      if (isEmpty(this.get('selectedCoord'))) {
        this.set('selectedCoord', systems[0]);
        this.set('selectedCategory', categories[this.get('selectedCoord')][0]);
      }
    }.bind(this));
  },

  actions: {
    setSelectedCoord(name) {
      if (this.get('selectedCoord') == name) return;

      this.set('selectedCoord', name);
      this.set('selectedCategory', this.get('categories')[name][0]);
    },

    setSelectedCategory(name) {
      if (this.get('selectedCategory') == name) return;

      this.set('selectedCategory', name);
    }
  }

});
