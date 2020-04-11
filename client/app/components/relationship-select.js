import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  modelName: '',
  displayKey: '',
  doneLoading: false,
  value: '',
  choices: null,

  // A callback function for registering component in a parent.
  registerCallback: null,

  api_data: service(),

  init() {
    this._super(...arguments);
    if (isEmpty(this.get('modelName'))) return;

    if (!isEmpty(this.get('registerCallback')))
      this.get('registerCallback')(this.get('modelName'), this);

    this.loadChoices();
  },

  loadChoices(forceReload) {
    this.set('doneLoading', false);
    let reload = forceReload || false;
    this.api_data.getAllRecords(this.get('modelName'), reload).then(function(records) {
      let choices = [];
      records.forEach(record => {
        choices.push({
          value: record.get('id'),
          display: record.get(this.get('displayKey'))
        });
      });
      this.set('choices', choices);
      this.set('doneLoading', true);
    }.bind(this));
  }

});
