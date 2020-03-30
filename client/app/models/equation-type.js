import DS from 'ember-data';
const { Model } = DS;
import { computed } from '@ember/object';

export default Model.extend({
  coordinate_system: DS.attr('string'),
  category: DS.attr('string'),
  ordinal: DS.attr('number'),
  equations: DS.hasMany('equation'),

  display: computed('coordinate_system', 'category', function() {
    return `${this.get('coordinate_system')} - ${this.get('category')}`;
  })
});
