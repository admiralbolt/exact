import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute: function(key) {
    return key;
  },

  keyForRelationship: function(key) {
    return key;
  },

  // Also, we need to remove the equation_file field on post. That's gonna be
  // handled seprately since file uploading is super jank.
  attrs: {
    source_file: {
      serialize: false
    },
    content_file: {
      serialize: false
    },
    equation_type: {
      serialize: true
    }
  }
});
