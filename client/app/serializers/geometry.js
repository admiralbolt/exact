import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  // By default the json api serializer dasherizes attributes. So the property
  // 'geometry_file' gets read as 'geometry-file' and doesn't get loaded correctly.
  // We override the serializer for the song model to not modify the attributes
  // in any way.
  keyForAttribute: function(key) {
    return key;
  },

  // Also, we need to remove the geometry_file field on post. That's gonna be
  // handled seprately since file uploading is super jank.
  attrs: {
    geometry_file: {
      serialize: false
    }
  }
});
