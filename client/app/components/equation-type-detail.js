import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { formatErrors } from 'client/utils/utils';

export default Component.extend({
  session: service(),
  store: service(),
  toast: service(),

  equation_type: null,
  category: '',
  coordinate_system: '',

  isEditing: false,
  isNew: false,
  tagName: '',
  showConfirmation: false,

  createCallback: null,
  cancelCallback: null,

  actions: {
    edit() {
      let equation_type = this.get('equation_type');
      this.set('category', equation_type.category);
      this.set('coordinate_system', equation_type.coordinate_system);
      this.set('isEditing', true);
    },

    toggleConfirmation() {
      this.set('showConfirmation', !this.get('showConfirmation'));
    },

    save() {
      let equation_type = this.get('equation_type');
      if (equation_type == null) {
        equation_type = this.get('store').createRecord('equation_type');
      }

      equation_type.set('category', this.get('category'));
      equation_type.set('coordinate_system', this.get('coordinate_system'));
      equation_type.save().then(function() {
        if (this.get('isNew')) {
          this.toast.success('Equation Type created successfully');
          this.get('createCallback')();
        }
        this.set('isEditing', false);
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        equation_type.rollbackAttributes();
      }.bind(this));
    },

    cancel() {
      if (this.get('isNew')) this.get('cancelCallback')();
      this.set('isEditing', false);
    },

    delete() {
      let model = this.get('equation_type');
      let modelName = model.name;
      model.deleteRecord();
      model.save().then(function() {
        this.toast.success(`Equation Type '${modelName}' Deleted.`);
      }.bind(this));
    }
  }
});
