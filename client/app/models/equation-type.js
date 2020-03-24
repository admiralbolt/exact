import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  name: DS.attr('string'),
  ordinal: DS.attr('number'),
  equations: DS.hasMany('equation')
});
