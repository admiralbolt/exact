import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import { A } from '@ember/array';
import { handleFetchErrors } from 'client/utils/utils';
import config from '../../config/environment';

export default Controller.extend({
  session: service(),
  api_data:service(),
  toast: service(),
  queue: service('file-queue'),

  fileList: A(),
  file: null,
  baseUrl: `${config.host}/uploads/misc`,
  showConfirmation: false,
  fileForDelete: null,

  fileName: computed('file', function() {
    return isNone(this.get('file')) ? 'No file selected' : this.get('file').split(/(\\|\/)/g).pop();
  }),

  uploadFile() {
    let headers = {
      // Apparently authorization has to be lower case, wtf?
      authorization: `Token ${this.session.data.authenticated.token}`,
      Accept: 'application/vnd.api+json'
    };
    headers['Content-Disposition'] = `attachment; filename=${this.file.name}`;
    return this.file.upload(`${config.host}/misc_files/upload/`, {
      headers: headers
    });
  },

  loadData() {
    let headers = {
      // Apparently authorization has to be lower case, wtf?
      authorization: `Token ${this.session.data.authenticated.token}`,
      Accept: 'application/vnd.api+json'
    };
    headers['Content-Type'] = 'application/vnd.api+json';
    let url = `${config.host}/misc_files/list/`;
    fetch(url, {
      headers: headers,
      method: 'get'
    }).then(handleFetchErrors).then(function(response) {
      response.json().then(function(jsonData) {
        this.set('fileList', jsonData['files']);
      }.bind(this));
    }.bind(this), function() {
      this.toast.error('Error fetching files');
    }.bind(this));
  },

  actions: {
    addFile(file) {
      this.set('file', file);
    },

    save() {
      this.uploadFile().then(function() {
        this.toast.success('File uploaded successfully');
        this.queue.find('file').set('files', A());
        this.set('file', null);
        this.loadData();
      }.bind(this), function(reason) {
        this.toast.error(`Error uploading file: ${reason}`);
      }.bind(this));
    },

    delete(file_name) {
      let headers = {
        // Apparently authorization has to be lower case, wtf?
        authorization: `Token ${this.session.data.authenticated.token}`,
        Accept: 'application/vnd.api+json'
      };
      headers['Content-Type'] = 'application/vnd.api+json';
      let url = `${config.host}/misc_files/delete/?file_name=${file_name}`;
      fetch(url, {
        headers: headers,
        method: 'post'
      }).then(handleFetchErrors).then(function() {
        this.toast.success('File deleted successfully');
        this.set('showConfirmation', false);
        this.loadData();
      }.bind(this), function(reason) {
        this.toast.error(`Error deleting file: ${reason}`);
        this.set('showConfirmation', false);
      }.bind(this));
    },

    deleteModal(file_name) {
      this.set('fileForDelete', file_name);
      this.set('showConfirmation', true);
    },

    toggleConfirmation() {
      this.set('showConfirmation', !this.get('showConfirmation'));
    }
  }

});
