import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { isNone } from '@ember/utils';
import { formatErrors } from 'client/utils/utils';
import config from '../config/environment';

let BASIC_FIELDS = ['name', 'author', 'is_live', 'date'];
let MODEL_FIELDS = ['equation_type', 'geometry', 'user'];
let FILE_FIELDS = ['source_file', 'content_file'];

export default Component.extend({
  session: service(),
  api_data: service(),
  toast: service(),

  equation: null,
  modelCopy: null,

  isEditing: false,
  isNew: false,
  equationTypeLoaded: false,

  source_file: null,
  content_file: null,

  actionCallback: null,


  didReceiveAttrs() {
    this._super(...arguments);
    this.set('modelCopy', this.get('equation').toJSON());
    this.get('equation').get('equation_type').then(function() {
      this.set('equationTypeLoaded', true);
    }.bind(this));
  },

  contentUrl: computed('equation.content_file', function() {
    return htmlSafe(`${this.get('equation.content_file')}`);
  }),

  showSource: computed('equation.source_file', function() {
    return this.get('session.isAuthenticated') && !isNone(this.get('equation.source_file'));
  }),

  sourceFileName: computed('equation.source_file', function() {
    return isNone(this.get('equation.source_file')) ? 'No file selected' : this.get('equation.source_file').split(/(\\|\/)/g).pop();
  }),

  contentFileName: computed('equation.content_file', function() {
    return isNone(this.get('equation.content_file')) ? 'No file selected' : this.get('equation.content_file').split(/(\\|\/)/g).pop();
  }),

  // Fetches all model relation fields from the db. A single promise is resolved
  // wrapping all promises to the db.
  _loadModelFields(equation, newData) {
    let modelPromises = [];
    MODEL_FIELDS.forEach(prop => {
      modelPromises.push(this.api_data.getRecord(prop, newData[prop]).then(function(record) {
        equation.set(prop, record);
      }));
    });
    return Promise.all(modelPromises);
  },

  _uploadFile(equationId, file, urlName) {
    let headers = {
      // Apparently authorization has to be lower case, wtf?
      authorization: `Token ${this.session.data.authenticated.token}`,
      Accept: 'application/vnd.api+json'
    };
    headers['Content-Disposition'] = `attachment; filename=${file.name}`;
    return file.upload(`${config.host}/equations/upload/${urlName}/?id=${equationId}`, {
      headers: headers
    });
  },

  // Uploads all files to the server. A single promise is returned wrapping all
  // file upload promises.
  uploadFiles(equationId) {
    let uploadPromises = [];
    FILE_FIELDS.forEach(function(fieldName) {
        let file = this.get(fieldName);
        if (file == null) return;

        let urlName = fieldName.split('_')[0];
        uploadPromises.push(this._uploadFile(equationId, file, urlName).then(function(response) {
          return {
            field: fieldName,
            status: 'success',
            response: response
          };
        }.bind(this), function(response) {
          return {
            field: fieldName,
            status: 'failure',
            response: response
          };
        }));
    }.bind(this));
    return Promise.all(uploadPromises);
  },


  actions: {
    addSourceFile(file) {
      this.set('source_file', file);
    },

    addContentFile(file) {
      this.set('content_file', file);
    },

    edit() {
      this.set('isEditing', true);
    },

    // Don't save edits reset views.
    cancel() {
      this.set('isEditing', false);
      this.set('modelCopy', this.get('equation'));
    },

    save() {
      let equation = this.get('equation');
      if (equation == null) {
        equation = this.get('api_data.store').createRecord('equation');
      }
      let newData = this.get('modelCopy');
      BASIC_FIELDS.forEach(prop => {
        equation.set(prop, newData[prop]);
      });
      this._loadModelFields(equation, newData).then(function() {
        equation.save().then(function(response) {
          if (isNone(this.get('source_file')) && isNone(this.get('content_file'))) {
            this.set('isEditing', false);
            this.toast.success('Equation edited successfully!');
            return;
          }
          this.uploadFiles(response.id).then(function(statuses) {
            let shouldHide = true;
            statuses.forEach(function(status) {
              if (status.status == 'success') return;

              shouldHide = false;
              this.toast.error(`Could not upload file for ${status.field}.`);
            }.bind(this));

            if (!shouldHide) return;

            this.set('isEditing', false);
            equation.reload();
            if (this.get('isNew')) this.get('actionCallback')();
          }.bind(this));
        }.bind(this), function(reason) {
          this.toast.error(formatErrors(reason.errors));
        }.bind(this));
      }.bind(this));
    }
  }
});
