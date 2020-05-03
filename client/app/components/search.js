import Component from '@ember/component';
import config from '../config/environment';
import { computed } from '@ember/object';
import { cancel, debounce, next } from '@ember/runloop';
import { isNone } from '@ember/utils';

export default Component.extend({
  keyword: '',
  displayResults: false,
  displayClass: computed('displayResults', function() {
    return this.get('displayResults') ? '' : 'hide';
  }),

  // For some reason clicking on a link fires both focusOut and focusIn.
  // Make sure we only fire one focus event at a time.
  _isFocusing: false,
  _debouncedSearch: null,
  searchResults: null,

  init() {
    this._super(...arguments);
    this.searchResults = [];
  },

  focusOut: function() {
    if (!this.get('_isFocusing')) {
      this.set('_isFocusing', true);
      setTimeout(function() {
        this.set('displayResults', false);
        this.set('_isFocusing', false);
      }.bind(this), 120);
    }
  },

  focusIn: function() {
    if (this.get('_isFocusing')) return;

    next(this, function() {
      this.set('displayResults', true);
    });
  },

  // If we hit enter immediately run search and cancel the debounce.
  keyPress: function(event) {
    if (event.key !== 'Enter') return;

    if (isNone(this.get('_debouncedSearch'))) {
      cancel(this.get('_debouncedSearch'));
    }

    this.search();
  },

  search: function() {
    return fetch(`${config.host}/search/?keyword=${this.get('keyword')}`)
      .then(function(result) {
        return result.json().then(function(data) {
          this.set('searchResults', data);
        }.bind(this));
      }.bind(this));
  },

  actions: {

    search: function() {
      this.set('_debouncedSearch', debounce(this, this.search, 300));
    }
  }
});
