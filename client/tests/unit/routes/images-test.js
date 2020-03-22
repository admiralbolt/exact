import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | images', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:images');
    assert.ok(route);
  });
});
