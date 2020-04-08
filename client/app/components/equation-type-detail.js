import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { formatErrors } from 'client/utils/utils';

export default Component.extend({
  toast: service(),

  equation_type: null,
  category: '',
  coordinate_system: '',

  isEditing: false,
  tagName: '',
  showConfirmation: false,

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
      equation_type.set('category', this.get('category'));
      equation_type.set('coordinate_system', this.get('coordinate_system'));
      equation_type.save().then(function() {
        this.set('isEditing', false);
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        equation_type.rollbackAttributes();
      }.bind(this));
    },

    cancel() {
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
