import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { formatErrors } from 'client/utils/utils';

export default Controller.extend({
  session: service(),
  store: service(),
  toast: service(),

  number: '',

  creatingNew: false,

  actions: {
    new() {
      this.set('number', '');
      this.set('creatingNew', true);
    },
    cancel() {
      this.set('number', '');
      this.set('creatingNew', false);
    },
    save() {
      let record = this.get('store').createRecord('geometry', {
        number: this.get('number')
      });
      record.save().then(function() {
        this.toast.success(`New Geometry created successfully.`);
        this.set('creatingNew', false);
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        record.unloadRecord();
      }.bind(this));
    }
  }
});
