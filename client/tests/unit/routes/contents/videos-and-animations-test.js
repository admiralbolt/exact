import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | contents/videos-and-animations', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:contents/videos-and-animations');
    assert.ok(route);
  });
});
