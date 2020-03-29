import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  name: DS.attr('string'),
  author: DS.attr('string'),
  date: DS.attr('string'),
  equation_type: DS.belongsTo('equation_type'),
  geometry: DS.belongsTo('geometry'),
  user: DS.belongsTo('user'),
  is_live: DS.attr('boolean'),
  source_file: DS.attr('string'),
  content_file: DS.attr('string')
});
