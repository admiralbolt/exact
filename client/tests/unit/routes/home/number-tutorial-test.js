import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | home/number-tutorial', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:home/number-tutorial');
    assert.ok(route);
  });
});
