import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  coordinate_system: DS.attr('string'),
  category: DS.attr('string'),
  ordinal: DS.attr('number'),
  equations: DS.hasMany('equation')
});
