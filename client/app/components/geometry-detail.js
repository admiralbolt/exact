import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { formatErrors } from 'client/utils/utils';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';
import config from '../config/environment';

export default Component.extend({
  toast: service(),
  session: service(),
  store: service(),

  geometry: null,
  number: '',
  geometry_file: null,

  isEditing: false,
  isNew: false,
  createCallback: null,
  cancelCallback: null,

  tagName: '',
  showConfirmation: false,

  imageFileName: computed('geometry.geometry_file', function() {
    return isNone(this.get('geometry.geometry_file')) ? 'No file selected' : this.get('geometry.geometry_file').split(/(\\|\/)/g).pop();
  }),

  uploadFile(id) {
    let fileForUpload = this.get('geometry_file');
    let headers = {
      // Apparently authorization has to be lower case, wtf?
      authorization: `Token ${this.session.data.authenticated.token}`,
      Accept: 'application/vnd.api+json'
    };
    headers['Content-Disposition'] = `attachment; filename=${fileForUpload.name}`;
    return fileForUpload.upload(`${config.host}/geometries/upload/?id=${id}`, {
      headers: headers
    });
  },

  actions: {
    addImageFile(file) {
      this.set('geometry_file', file);
    },

    edit() {
      let geometry = this.get('geometry');
      this.set('number', geometry.number);
      this.set('isEditing', true);
    },

    toggleConfirmation() {
      this.set('showConfirmation', !this.get('showConfirmation'));
    },

    save() {
      let geometry = this.get('geometry');
      if (geometry == null) {
        geometry = this.get('store').createRecord('geometry');
      }

      geometry.set('number', this.get('number'));
      geometry.save().then(function(response) {
        if (this.get('geometry_file') == null) {
          this.set('isEditing', false);
          return;
        }

        this.uploadFile(response.id).then(function() {
          geometry.reload();
          this.set('isEditing', false);
          if (this.get('isNew')) {
            this.toast.success('Geometry created successfully!');
            this.get('createCallback')();
            return;
          }
          this.toast.success('Geometry edited successfully!');
        }.bind(this), function(reason) {
          this.toast.warning(`Could not upload geometry_file: ${formatErrors(reason.errors)}`);
        }.bind(this));
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        geometry.rollbackAttributes();
      }.bind(this));
    },

    cancel() {
      if (this.get('isNew')) this.get('cancelCallback')();
      this.set('isEditing', false);
    },

    delete() {
      let model = this.get('geometry');
      let number = model.get('number');
      model.deleteRecord();
      model.save().then(function() {
        this.toast.success(`Geometry '${number}' Deleted.`);
      }.bind(this));
    }
  }

});
