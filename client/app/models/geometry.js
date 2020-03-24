import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  number: DS.attr('string'),
  geometry_file: DS.attr('string'),
  equations: DS.hasMany('equation')
});
