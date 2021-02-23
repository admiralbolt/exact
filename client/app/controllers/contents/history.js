import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _sortProperties: ['date:desc'],
  sortedEquations: sort('model.equations', '_sortProperties')

});
