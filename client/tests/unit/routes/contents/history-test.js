import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | contents/history', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:contents/history');
    assert.ok(route);
  });
});
