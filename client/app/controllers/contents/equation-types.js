import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { formatErrors } from 'client/utils/utils';

export default Controller.extend({
  session: service(),
  store: service(),
  toast: service(),
  category: '',
  coordinate_system: '',
  creatingNew: false,

  actions: {
    new() {
      this.set('category', '');
      this.set('coordinate_system', '');
      this.set('creatingNew', true);
    },
    cancel() {
      this.set('category', '');
      this.set('coordinate_system', '');
      this.set('creatingNew', false);
    },
    save() {
      let record = this.get('store').createRecord('equation_type', {
        coordinate_system: this.get('coordinate_system'),
        category: this.get('category')
      });
      record.save().then(function() {
        this.toast.success(`New Equation Type created successfully.`);
        this.set('creatingNew', false);
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        record.unloadRecord();
      }.bind(this));
    }
  }
});
