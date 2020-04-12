import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  primaryKey: 'id',
  keyForAttribute: function(key) {
    return key;
  }
});
