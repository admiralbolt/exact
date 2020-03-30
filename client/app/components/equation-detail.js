import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { isNone } from '@ember/utils';

let BASIC_FIELDS = ['name', 'author', 'is_live', 'date'];
let MODEL_FIELDS = ['equation_type', 'geometry', 'user'];
let FILE_FIELDS = ['source_file', 'content_file'];

export default Component.extend({
  // The equation to display
  equation: null,
  // ModelCopy
  modelCopy: null,
  session: service(),
  api_data: service(),

  isEditing: false,
  isNew: false,
  displayForm: or('isEditing', 'isNew'),

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('modelCopy', this.get('equation').toJSON());
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


  actions: {
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
      let newData = this.get('modelCopy');
      BASIC_FIELDS.forEach(prop => {
        equation.set(prop, newData[prop]);
      });
      this._loadModelFields(equation, newData).then(function() {
        equation.save().then(function() {
          this.set('isEditing', false);
        }.bind(this));
      }.bind(this));
    },

    create() {
      // Nothing yet :)
    }
  }
});
