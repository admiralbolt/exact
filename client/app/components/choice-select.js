import Component from '@ember/component';

export default Component.extend({
  // Choices should be input as a list of dictionaries with two keys: value
  // and display. Like so:
  // [{value: 'hello', display: 'Hello'}, {value: 'something', display: 'Some Thing'}]
  choices: null,
  value: null,

  init() {
    this._super(...arguments);
    this.choices = this.choices || [];
    if (this.choices.length == 0) return;

    // I don't really understand this, but in order for this to work I need to
    // run it through a timeout function. Seems like the extra time just from
    // wrapping in setTimeout is enough to make it work...
    setTimeout(function() {
      this.set('value', this.choices[0].value);
    }.bind(this), 0);
  },

  actions: {
    setSelection(value) {
      this.set('value', value);
    }
  }
});
