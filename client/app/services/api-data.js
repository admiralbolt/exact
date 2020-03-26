import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  getAllRecords(modelName) {
    let records = this.get('store').peekAll(modelName);

    return records.length === 0 ?
      this.get('store').findAll(modelName) :
      new Promise(function(resolve) { resolve(records); });
  }
});
