import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { isNone } from '@ember/utils';
import { A } from '@ember/array';
import { formatErrors } from 'client/utils/utils';
import config from '../config/environment';

let BASIC_FIELDS = ['name', 'author', 'is_live', 'date'];
let MODEL_FIELDS = ['equation_type', 'geometry', 'user'];
let FILE_FIELDS = ['source_file', 'content_file'];

export default Component.extend({
  session: service(),
  currentUser: service(),
  api_data: service(),
  toast: service(),
  queue: service('file-queue'),
  router: service(),

  equation: null,
  modelCopy: null,

  isEditing: false,
  isNew: false,
  equationTypeLoaded: false,

  source_file: null,
  content_file: null,

  createCallback: null,
  cancelCallback: null,

  // Three different modals:
  //  * Delete Confirmation
  //  * Define New Equation Type
  //  * Define New Geometry
  showDeleteModal: false,
  showGeometryModal: false,
  showEquationTypeModal: false,

  // When data is live created, child relationship selects need to be update.
  // To do this, we'll register children relationship selects and notify them
  // when data gets updated. Children will be an object mapping name -> component.
  children: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('children', {});
    this.set('modelCopy', {});
    let equation = this.get('equation');
    if (equation == null) {
      let modelCopy = this.get('modelCopy');
      this.api_data.getAllRecords('equation_type', function(equation_types) {
        set(modelCopy, 'equation_type', equation_types.get('firstObject'));
      }.bind(this));
      this.api_data.getAllRecords('geometry', function(geometrys) {
        set(modelCopy, 'geometry', geometrys.get('firstObject'));
      }.bind(this));

      set(modelCopy, 'is_live', false);
      set(modelCopy, 'user', this.get('currentUser.user.id'));
      this.set('equationTypeLoaded', true);
      return;
    }

    equation.get('equation_type').then(function() {
      this.set('equationTypeLoaded', true);
    }.bind(this));
  },

  hasAccess: computed('currentUser.{user,user.is_staff}', 'equation.user', function() {
    return this.get('currentUser.user.is_staff') || this.get('currentUser.user') == this.get('equation.user');
  }),

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
    // Relationship select registration.
    registerChild(name, child) {
      set(this.get('children'), name, child);
    },

    // Modal action callbacks.
    toggleModal(name) {
      let modalName = `show${name}Modal`;
      this.set(modalName, !this.get(modalName));
    },

    geometryCreated() {
      this.get('children')['geometry'].loadChoices(/*forceReload=*/true);
      this.set('showGeometryModal', false);
    },

    geometryCanceled() {
      this.set('showGeometryModal', false);
    },

    equationTypeCreated() {
      this.get('children')['equation_type'].loadChoices(/*forceReload=*/true);
      this.set('showEquationTypeModal', false);
    },

    equationTypeCanceled() {
      this.set('showEquationTypeModal', false);
    },

    addSourceFile(file) {
      this.set('source_file', file);
    },

    addContentFile(file) {
      this.set('content_file', file);
    },

    edit() {
      this.set('modelCopy', this.get('equation').toJSON());
      this.set('isEditing', true);
    },

    // Don't save edits reset views.
    cancel() {
      this.queue.find('source_file').set('files', A());
      this.queue.find('content_file').set('files', A());
      this.set('source_file', null);
      this.set('content_file', null);
      this.set('isEditing', false);
      if (this.get('isNew')) this.get('cancelCallback')();
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
            if (this.get('isNew')) this.get('createCallback')();
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
            if (this.get('isNew')) this.get('createCallback')();
          }.bind(this));
        }.bind(this), function(reason) {
          this.toast.error(formatErrors(reason.errors));
        }.bind(this));
      }.bind(this));
    },

    delete() {
      let model = this.get('equation');
      let modelName = model.name;
      model.deleteRecord();
      model.save().then(function() {
        this.toast.success(`Equation '${modelName}' Deleted.`);
        this.get('router').transitionTo('contents.index');
      }.bind(this));
    }
  }
});
