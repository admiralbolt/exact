import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  getAllRecords(modelName, forceReload) {
    let reload = forceReload || false;
    if (reload) return this.get('store').findAll(modelName, {reload: true});

    let records = this.get('store').peekAll(modelName);
    return records.length < 2 ?
      this.get('store').findAll(modelName, {reload: true}) :
      new Promise(function(resolve) { resolve(records); });
  },

  getRecord(modelName, id) {
    let store = this.get('store');
    let record = store.peekRecord(modelName, id);
    return record === null ?
      store.findRecord(modelName, id) :
      new Promise(function(resolve) { resolve(record); });
  }
});
