import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({

  _sortProperties: ['date:desc'],
  sortedEquations: sort('model.equations', '_sortProperties')

});
