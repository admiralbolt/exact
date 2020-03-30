import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  modelName: '',
  displayKey: '',
  doneLoading: false,
  value: '',
  choices: null,

  api_data: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (isEmpty(this.get('modelName'))) return;

    this.api_data.getAllRecords(this.get('modelName')).then(function(records) {
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
